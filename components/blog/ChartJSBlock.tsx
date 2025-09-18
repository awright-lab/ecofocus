'use client';

import React, { useEffect, useRef } from 'react';
import {
  Chart,
  BarController, BarElement,
  LineController, LineElement, PointElement,
  PieController, DoughnutController,
  RadarController, PolarAreaController,
  CategoryScale, LinearScale, RadialLinearScale,
  ArcElement, Filler, Tooltip, Legend,
  ScatterController, BubbleController,
  Plugin,
} from 'chart.js';

Chart.register(
  BarController, BarElement,
  LineController, LineElement, PointElement,
  PieController, DoughnutController,
  RadarController, PolarAreaController,
  ScatterController, BubbleController,
  CategoryScale, LinearScale, RadialLinearScale,
  ArcElement, Filler, Tooltip, Legend
);

type ChartKind =
  | 'bar' | 'line' | 'pie' | 'doughnut'
  | 'radar' | 'polarArea' | 'scatter' | 'bubble'
  | 'area' | 'donut';

type NormalizedChartKind =
  | 'bar' | 'line' | 'pie' | 'doughnut'
  | 'radar' | 'polarArea' | 'scatter' | 'bubble';

type Props = {
  chartType: ChartKind;
  data: any;        // { labels, datasets }
  options?: any;    // Chart.js options
  height?: number;  // px
  caption?: string;
  unit?: string;    // optional unit suffix for ticks & labels
};

/* ------------------ helpers ------------------ */

function safeParse<T = any>(v: any): T | undefined {
  if (v == null) return undefined;
  if (typeof v === 'string') {
    try { return JSON.parse(v) as T; } catch { return undefined; }
  }
  return v as T;
}

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
const toHex = (x: number) => clamp(Math.round(x), 0, 255).toString(16).padStart(2, '0');

function cssColorToHex(s: string): string | null {
  const t = s.trim();
  // #abc or #aabbcc
  if (t[0] === '#') {
    if (t.length === 4) {
      const r = t[1], g = t[2], b = t[3];
      return `#${r}${r}${g}${g}${b}${b}`;
    }
    return t.slice(0, 7); // ignore alpha channel if #RRGGBBAA
  }
  // rgb/rgba
  const m = /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/i.exec(t);
  if (m) {
    const r = Number(m[1]), g = Number(m[2]), b = Number(m[3]);
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }
  return null;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return null;
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
}

function shadeHex(hex: string, pct: number): string {
  const c = hexToRgb(hex);
  if (!c) return hex;
  const mixUp = (x: number) => clamp(Math.round(x + (255 - x) * pct), 0, 255);
  const mixDown = (x: number) => clamp(Math.round(x * (1 + pct)), 0, 255);
  const r = pct >= 0 ? mixUp(c.r) : mixDown(c.r);
  const g = pct >= 0 ? mixUp(c.g) : mixDown(c.g);
  const b = pct >= 0 ? mixUp(c.b) : mixDown(c.b);
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/** scriptable gradient from a base hex color */
function gradientFrom(baseHex: string) {
  return (ctx: any) => {
    const { chart } = ctx;
    const { ctx: g, chartArea } = chart;
    if (!chartArea) return baseHex; // first layout pass
    const horizontal = chart.options?.indexAxis === 'y';
    const grad = g.createLinearGradient(
      horizontal ? chartArea.left : 0,
      horizontal ? 0 : chartArea.bottom,
      horizontal ? chartArea.right : 0,
      horizontal ? 0 : chartArea.top,
    );
    const c0 = shadeHex(baseHex, 0.20);   // lighter
    const c1 = shadeHex(baseHex, -0.08);  // slightly darker
    grad.addColorStop(0, c0);
    grad.addColorStop(1, c1);
    return grad;
  };
}

/* ------------------ tiny plugins ------------------ */

// Value labels at the end of bars
const valueLabelPlugin: Plugin = {
  id: 'valueLabel',
  afterDatasetsDraw(chart) {
    const cfg: any = (chart.options?.plugins as any)?.valueLabel || {};
    if (!cfg.display) return;

    const unit: string = cfg.unit ?? '';
    const color: string = cfg.color ?? '#334155';
    const fontSize: number = cfg.fontSize ?? 12;
    const padding: number = cfg.padding ?? 6;

    const ctx = chart.ctx;
    const horizontal = chart.options?.indexAxis === 'y';
    const valueScale = chart.scales[horizontal ? 'x' : 'y'];
    const catScale = chart.scales[horizontal ? 'y' : 'x'];

    ctx.save();
    ctx.fillStyle = color;
    ctx.font = `${fontSize}px system-ui, -apple-system, Segoe UI, Roboto, sans-serif`;
    ctx.textBaseline = 'middle';

    chart.data.datasets.forEach((ds: any, di: number) => {
      const meta = chart.getDatasetMeta(di);
      if (!meta?.data) return;
      meta.data.forEach((_el: any, i: number) => {
        const raw = Array.isArray(ds.data) ? ds.data[i] : undefined;
        if (raw == null || isNaN(raw)) return;
        const val = Number(raw);
        const endPx = valueScale.getPixelForValue(val);
        const catPx = catScale.getPixelForValue(i);
        const text = `${val}${unit ? ` ${unit}` : ''}`;

        if (horizontal) {
          ctx.textAlign = 'left';
          ctx.fillText(text, endPx + padding, catPx);
        } else {
          ctx.textAlign = 'center';
          ctx.fillText(text, catPx, endPx - padding);
        }
      });
    });

    ctx.restore();
  },
};

/* ------------------ component ------------------ */

export default function ChartJSBlock({
  chartType,
  data,
  options,
  height = 360,
  caption,
  unit,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data) return;

    const parsedData = safeParse<any>(data);
    const parsedOptions = safeParse<any>(options) ?? {};
    if (!parsedData) return;

    const dataObj = JSON.parse(JSON.stringify(parsedData));
    const opts: any = JSON.parse(JSON.stringify(parsedOptions));

    // Normalize chart type
    const effectiveType: NormalizedChartKind =
      chartType === 'donut' ? 'doughnut'
      : chartType === 'area' ? 'line'
      : (chartType as NormalizedChartKind);

    // Orientation (bars)
    if (effectiveType === 'bar') {
      const orientation = typeof opts.orientation === 'string' ? opts.orientation : undefined;
      if (opts.indexAxis == null && orientation) {
        opts.indexAxis = orientation === 'row' ? 'y' : 'x';
      }
      if (opts.indexAxis == null) opts.indexAxis = 'x';
    }

    const numericAxisKey: 'x' | 'y' =
      effectiveType === 'bar' && opts.indexAxis === 'y' ? 'x' : 'y';

    // Rounded corners & no borders by default for bars
    if (effectiveType === 'bar' && Array.isArray(dataObj.datasets)) {
      for (const ds of dataObj.datasets) {
        if (ds.type && ds.type !== 'bar') continue;
        if (ds.borderRadius == null) ds.borderRadius = typeof opts.barRadius === 'number' ? opts.barRadius : 10;
        if (ds.borderSkipped == null) ds.borderSkipped = false;
        // respect explicit barBorderWidth; default = 0 (no border)
        const borderW = typeof opts.barBorderWidth === 'number' ? opts.barBorderWidth : 0;
        ds.borderWidth = borderW;
        if (borderW === 0) ds.borderColor = undefined;
      }
    }

    // Area (line with fill)
    if (chartType === 'area' && Array.isArray(dataObj.datasets)) {
      for (const ds of dataObj.datasets) {
        if (ds.type && ds.type !== 'line') continue;
        if (ds.fill == null) ds.fill = true;
        if (ds.tension == null) ds.tension = 0.3;
      }
      opts.elements = opts.elements ?? {};
      opts.elements.line = { ...(opts.elements.line ?? {}), fill: true };
    }

    // Subtle grid & no axis borders
    const faint = 'rgba(0,0,0,0.08)';
    opts.scales = opts.scales ?? {};
    for (const ax of ['x', 'y'] as const) {
      opts.scales[ax] = opts.scales[ax] ?? {};
      const grid = opts.scales[ax].grid = opts.scales[ax].grid ?? {};
      if (grid.display !== false && grid.color == null) grid.color = faint;
      const border = opts.scales[ax].border = opts.scales[ax].border ?? {};
      if (typeof border.display !== 'boolean') border.display = false;
      const ticks = opts.scales[ax].ticks = opts.scales[ax].ticks ?? {};
      if (ticks.color == null) ticks.color = 'rgba(0,0,0,0.45)';
    }

    // Defaults
    if (opts.responsive == null) opts.responsive = true;
    if (opts.maintainAspectRatio == null) opts.maintainAspectRatio = false;
    opts.plugins = opts.plugins ?? {};
    if (opts.plugins.legend == null) {
      opts.plugins.legend = { display: true, position: 'top' };
    }

    // Tooltip unit (unless overridden)
    opts.plugins.tooltip = opts.plugins.tooltip ?? {};
    const hasCustomTooltipLabel = !!opts.plugins.tooltip?.callbacks?.label;
    if (unit && !hasCustomTooltipLabel) {
      opts.plugins.tooltip.callbacks = opts.plugins.tooltip.callbacks ?? {};
      opts.plugins.tooltip.callbacks.label = (ctx: any) => {
        const base = ctx.dataset?.label ? `${ctx.dataset.label}: ` : '';
        return `${base}${ctx.formattedValue}${unit ? ` ${unit}` : ''}`;
      };
    }

    // Axis unit suffix
    if (unit) {
      const axis = opts.scales[numericAxisKey] = opts.scales[numericAxisKey] ?? {};
      axis.ticks = axis.ticks ?? {};
      if (axis.ticks.callback == null) {
        axis.ticks.callback = (value: any) => `${value} ${unit}`;
      }
    }

    // ---- FORCE SOLID FILLS + APPLY GRADIENT ----
    // If CMS sent rgba(..., a<1), convert to hex and make a gradient so bars never look "washed out".
    if (Array.isArray(dataObj.datasets)) {
      dataObj.datasets.forEach((ds: any) => {
        // normalize single string color
        if (typeof ds.backgroundColor === 'string') {
          const hex = cssColorToHex(ds.backgroundColor);
          if (hex) ds.backgroundColor = gradientFrom(hex);
        }
        // normalize array of colors (rare for bars, but safe)
        if (Array.isArray(ds.backgroundColor)) {
          ds.backgroundColor = ds.backgroundColor.map((c: any) => {
            if (typeof c !== 'string') return c;
            const hex = cssColorToHex(c);
            return hex ? hex : c;
          });
        }
      });
    }

    // Enable value labels (auto-on if unit includes '%')
    const wantLabels =
      (opts.plugins && (opts.plugins as any).valueLabel?.display) ??
      (typeof unit === 'string' && unit.includes('%'));
    (opts.plugins as any).valueLabel = {
      ...((opts.plugins as any).valueLabel ?? {}),
      display: wantLabels,
      unit,
      color: (opts.plugins as any)?.valueLabel?.color ?? '#374151',
      fontSize: (opts.plugins as any)?.valueLabel?.fontSize ?? 12,
      padding: (opts.plugins as any)?.valueLabel?.padding ?? 6,
    };

    // Build chart
    chartRef.current?.destroy();
    chartRef.current = new Chart(canvas, {
      type: effectiveType as any,
      data: dataObj,
      options: opts,
      plugins: [valueLabelPlugin],
    });

    return () => chartRef.current?.destroy();
  }, [chartType, data, options, unit]);

  return (
    <figure className="my-6">
      <div style={{ height }}>
        <canvas ref={canvasRef} />
      </div>
      {caption && (
        <figcaption className="mt-2 text-sm text-gray-600">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}




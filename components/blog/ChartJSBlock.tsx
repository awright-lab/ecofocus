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
  data: any;
  options?: any;
  height?: number;
  caption?: string;
  unit?: string;
};

/* ---------- helpers ---------- */
function safeParse<T = any>(v: any): T | undefined {
  if (v == null) return undefined;
  if (typeof v === 'string') { try { return JSON.parse(v) as T; } catch { return undefined; } }
  return v as T;
}
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
const toHex = (x: number) => clamp(Math.round(x), 0, 255).toString(16).padStart(2, '0');

function cssColorToHex(s: string): string | null {
  const t = s.trim();
  if (t[0] === '#') return t.length === 4 ? `#${t[1]}${t[1]}${t[2]}${t[2]}${t[3]}${t[3]}` : t.slice(0, 7);
  const m = /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/i.exec(t);
  if (m) { const r = Number(m[1]), g = Number(m[2]), b = Number(m[3]); return `#${toHex(r)}${toHex(g)}${toHex(b)}`; }
  return null;
}
function hexToRgb(hex: string) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m ? { r: parseInt(m[1],16), g: parseInt(m[2],16), b: parseInt(m[3],16) } : null;
}
function shadeHex(hex: string, pct: number) {
  const c = hexToRgb(hex); if (!c) return hex;
  const mixUp = (x: number) => clamp(Math.round(x + (255 - x) * pct), 0, 255);
  const mixDown = (x: number) => clamp(Math.round(x * (1 + pct)), 0, 255);
  const r = pct >= 0 ? mixUp(c.r) : mixDown(c.r);
  const g = pct >= 0 ? mixUp(c.g) : mixDown(c.g);
  const b = pct >= 0 ? mixUp(c.b) : mixDown(c.b);
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/** Linear gradient for bars */
function linearGradientFrom(baseHex: string) {
  return (ctx: any) => {
    const { chart } = ctx;
    const { ctx: g, chartArea } = chart;
    if (!chartArea) return baseHex;
    const horizontal = chart.options?.indexAxis === 'y';
    const grad = g.createLinearGradient(
      horizontal ? chartArea.left : 0,
      horizontal ? 0 : chartArea.bottom,
      horizontal ? chartArea.right : 0,
      horizontal ? 0 : chartArea.top,
    );
    const c0 = shadeHex(baseHex, 0.20);   // lighter at start
    const c1 = shadeHex(baseHex, -0.08);  // slightly darker at end
    grad.addColorStop(0, c0);
    grad.addColorStop(1, c1);
    return grad;
  };
}

/** Radial gradient for doughnut/pie (inner lighter ➜ outer slightly darker) */
function arcGradientFrom(baseHex: string) {
  return (ctx: any) => {
    const { chart, datasetIndex, dataIndex } = ctx;
    const meta = chart.getDatasetMeta(datasetIndex);
    const arc = meta?.data?.[dataIndex] as any;
    if (!arc) return baseHex;
    const g = chart.ctx;
    const grad = g.createRadialGradient(arc.x, arc.y, arc.innerRadius, arc.x, arc.y, arc.outerRadius);
    const c0 = shadeHex(baseHex, 0.15);
    const c1 = shadeHex(baseHex, -0.08);
    grad.addColorStop(0, c0);
    grad.addColorStop(1, c1);
    return grad;
  };
}

/* ---------- drawing utils ---------- */
function drawWrapped(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = String(text).split(/\s+/);
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    const test = cur ? cur + ' ' + w : w;
    if (ctx.measureText(test).width <= maxWidth || !cur) cur = test;
    else { lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);

  const totalH = lines.length * lineHeight;
  let y0 = y - totalH / 2 + lineHeight / 2;
  for (const line of lines) { ctx.fillText(line, x, y0); y0 += lineHeight; }
}

/* ---------- plugins ---------- */
// Value labels at bar ends (kept)
const valueLabelPlugin: Plugin = {
  id: 'valueLabel',
  afterDatasetsDraw(chart) {
    const cfg: any = (chart.options?.plugins as any)?.valueLabel || {};
    if (!cfg.display) return;

    const unit: string = cfg.unit ?? '';
    const color: string = cfg.color ?? '#1f2937';
    const fontSize: number = cfg.fontSize ?? 12;
    const padding: number = cfg.padding ?? 6;

    const ctx = chart.ctx;
    const horizontal = chart.options?.indexAxis === 'y';

    ctx.save();
    ctx.fillStyle = color;
    ctx.font = `${fontSize}px system-ui, -apple-system, Segoe UI, Roboto, sans-serif`;
    ctx.textBaseline = 'middle';

    chart.data.datasets.forEach((ds: any, di: number) => {
      const meta = chart.getDatasetMeta(di);
      if (!meta?.data) return;

      meta.data.forEach((el: any, i: number) => {
        const raw = Array.isArray(ds.data) ? ds.data[i] : undefined;
        if (raw == null || isNaN(raw)) return;

        const val = Number(raw);
        const { x, y } = el.getProps(['x', 'y'], true);
        const label = `${val}${unit ? ` ${unit}` : ''}`;

        if (horizontal) {
          const tw = ctx.measureText(label).width;
          const rightPad =
            typeof (chart.options?.layout as any)?.padding?.right === 'number'
              ? (chart.options!.layout as any).padding.right
              : 0;
          const canvasRight = chart.width - rightPad - 4;
          const txOutside = x + padding;

          if (txOutside + tw <= canvasRight) {
            ctx.textAlign = 'left';
            ctx.fillText(label, txOutside, y);
          } else {
            ctx.textAlign = 'right';
            ctx.fillText(label, x - padding, y);
          }
        } else {
          ctx.textAlign = 'center';
          ctx.fillText(label, x, y - padding);
        }
      });
    });

    ctx.restore();
  },
};

// Center value for doughnut/pie (kept)
const centerLabelPlugin: Plugin = {
  id: 'centerLabel',
  afterDraw(chart) {
    const cfg: any = (chart.options?.plugins as any)?.centerLabel;
    if (!cfg?.display) return;
    const meta = chart.getDatasetMeta(0);
    const arc = meta?.data?.[0] as any;
    if (!arc) return;

    const ds = chart.data.datasets?.[0] as any;
    const arr = (ds?.data ?? []) as any[];
    if (!arr.length) return;

    const sum = arr.reduce((a, b) => a + (Number(b) || 0), 0);
    const target = cfg.useMax ? Math.max(...arr.map((v: any) => Number(v) || 0)) : Number(arr[0]) || 0;

    let text: string;
    if (cfg.percent || (cfg.unit && String(cfg.unit).includes('%'))) {
      const pct = sum > 0 ? Math.round((target / sum) * 100) : 0;
      text = `${pct}${cfg.unit ?? '%'}`;
    } else {
      text = `${target}${cfg.unit ? ` ${cfg.unit}` : ''}`;
    }

    const { x, y, innerRadius } = arc;
    const ctx = chart.ctx;
    const size = cfg.fontSize ?? Math.max(18, Math.floor(innerRadius * 0.6));
    ctx.save();
    ctx.fillStyle = cfg.color ?? '#374151';
    ctx.font = `700 ${size}px system-ui, -apple-system, Segoe UI, Roboto, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y);
    ctx.restore();
  },
};

// Wrapped side label for doughnut/pie (kept)
const sideLabelPlugin: Plugin = {
  id: 'sideLabel',
  afterDraw(chart) {
    const cfg: any = (chart.options?.plugins as any)?.sideLabel;
    if (!cfg?.display) return;

    const meta = chart.getDatasetMeta(0);
    const arc = meta?.data?.[0] as any;
    if (!arc) return;

    const text =
      cfg.text ??
      (Array.isArray(chart.data?.labels) ? String(chart.data.labels[0] ?? '') : '');
    if (!text) return;

    const { x, y, outerRadius } = arc;
    const ctx = chart.ctx;

    const color = cfg.color ?? '#111827';
    const fontSize = cfg.fontSize ?? 18;
    const lineHeight = (cfg.lineHeight ?? 1.25) * fontSize;
    const offset = cfg.offset ?? 18;
    const desiredMax = cfg.maxWidth ?? 280;
    const available = chart.width - (x + outerRadius + offset) - 8;
    const maxW = Math.max(60, Math.min(desiredMax, available));

    ctx.save();
    ctx.fillStyle = color;
    ctx.font = `600 ${fontSize}px system-ui, -apple-system, Segoe UI, Roboto, sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    drawWrapped(ctx, text, x + outerRadius + offset, y, maxW, lineHeight);
    ctx.restore();
  },
};

/* ---------- component ---------- */
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

    const effectiveType: NormalizedChartKind =
      chartType === 'donut' ? 'doughnut'
      : chartType === 'area' ? 'line'
      : (chartType as NormalizedChartKind);

    // bars orientation
    if (effectiveType === 'bar') {
      const orientation = typeof opts.orientation === 'string' ? opts.orientation : undefined;
      if (opts.indexAxis == null && orientation) opts.indexAxis = orientation === 'row' ? 'y' : 'x';
      if (opts.indexAxis == null) opts.indexAxis = 'x';
    }

    const isPieLike = effectiveType === 'doughnut' || effectiveType === 'pie';
    const isBar = effectiveType === 'bar';
    const isHorizontal = isBar && opts.indexAxis === 'y';
    const categoryAxisKey: 'x' | 'y' = isHorizontal ? 'y' : 'x';
    const valueAxisKey: 'x' | 'y' = isHorizontal ? 'x' : 'y';

    // bar rounding / borders
    if (isBar && Array.isArray(dataObj.datasets)) {
      for (const ds of dataObj.datasets) {
        if (ds.type && ds.type !== 'bar') continue;
        if (ds.borderRadius == null) ds.borderRadius = typeof opts.barRadius === 'number' ? opts.barRadius : 10;
        if (ds.borderSkipped == null) ds.borderSkipped = false;
        const borderW = typeof opts.barBorderWidth === 'number' ? opts.barBorderWidth : 0;
        ds.borderWidth = borderW;
        if (borderW === 0) ds.borderColor = undefined;
      }
    }

    // area (line+fill)
    if (chartType === 'area' && Array.isArray(dataObj.datasets)) {
      for (const ds of dataObj.datasets) {
        if (ds.type && ds.type !== 'line') continue;
        if (ds.fill == null) ds.fill = true;
        if (ds.tension == null) ds.tension = 0.3;
      }
      opts.elements = opts.elements ?? {};
      opts.elements.line = { ...(opts.elements.line ?? {}), fill: true };
    }

    // cartesian scales vs pie-like
    const faint = 'rgba(0,0,0,0.08)';
    if (!isPieLike) {
      opts.scales = opts.scales ?? {};
      for (const ax of ['x', 'y'] as const) {
        opts.scales[ax] = opts.scales[ax] ?? {};
        const grid = (opts.scales[ax].grid = opts.scales[ax].grid ?? {});
        if (grid.display !== false && grid.color == null) grid.color = faint;
        const border = (opts.scales[ax].border = opts.scales[ax].border ?? {});
        if (typeof border.display !== 'boolean') border.display = false;
        const ticks = (opts.scales[ax].ticks = opts.scales[ax].ticks ?? {});
        if (ticks.color == null) ticks.color = 'rgba(0,0,0,0.45)';
      }
      const cat = opts.scales[categoryAxisKey] ?? {};
      cat.ticks = { ...(cat.ticks ?? {}), color: '#000', font: { ...(cat.ticks?.font ?? {}), weight: '500' } };
      opts.scales[categoryAxisKey] = cat;
    } else {
      delete opts.scales;
      // default slightly smaller doughnut if not specified
      if (effectiveType === 'doughnut' && opts.cutout == null) {
        opts.cutout = '58%';
      }
    }

    // defaults
    if (opts.responsive == null) opts.responsive = true;
    if (opts.maintainAspectRatio == null) opts.maintainAspectRatio = false;
    opts.plugins = opts.plugins ?? {};
    if (opts.plugins.legend == null) opts.plugins.legend = { display: true, position: 'top' };

    // tooltips
    opts.plugins.tooltip = opts.plugins.tooltip ?? {};
    const hasCustomTooltipLabel = !!opts.plugins.tooltip?.callbacks?.label;
    if (unit && !hasCustomTooltipLabel) {
      opts.plugins.tooltip.callbacks = opts.plugins.tooltip.callbacks ?? {};
      opts.plugins.tooltip.callbacks.label = (ctx: any) => {
        const base = ctx.dataset?.label ? `${ctx.dataset.label}: ` : '';
        return `${base}${ctx.formattedValue}${unit ? ` ${unit}` : ''}`;
      };
    }

    // tick unit (cartesian only)
    if (!isPieLike && unit) {
      const axis = opts.scales[valueAxisKey] = opts.scales[valueAxisKey] ?? {};
      axis.ticks = axis.ticks ?? {};
      if (axis.ticks.callback == null) axis.ticks.callback = (value: any) => `${value} ${unit}`;
    }

    // ====== POLISH FOR FILLS ======
    if (Array.isArray(dataObj.datasets)) {
      dataObj.datasets.forEach((ds: any) => {
        // Doughnut/Pie: rounded ends + radial gradient fills
        if (isPieLike) {
          if (ds.borderRadius == null) ds.borderRadius = typeof opts.arcRadius === 'number' ? opts.arcRadius : 10;
          if (ds.spacing == null) ds.spacing = 2;     // subtle separation
          if (ds.borderWidth == null) ds.borderWidth = 0;

          if (typeof ds.backgroundColor === 'string') {
            const hex = cssColorToHex(ds.backgroundColor);
            if (hex) ds.backgroundColor = arcGradientFrom(hex);
          } else if (Array.isArray(ds.backgroundColor)) {
            ds.backgroundColor = ds.backgroundColor.map((c: any) => {
              if (typeof c !== 'string') return c;
              const hex = cssColorToHex(c);
              return hex ? arcGradientFrom(hex) : c;
            });
          }
        } else {
          // Bars/lines: keep linear gradient conversion you already had
          if (typeof ds.backgroundColor === 'string') {
            const hex = cssColorToHex(ds.backgroundColor);
            if (hex) ds.backgroundColor = linearGradientFrom(hex);
          } else if (Array.isArray(ds.backgroundColor)) {
            ds.backgroundColor = ds.backgroundColor.map((c: any) => {
              if (typeof c !== 'string') return c;
              const hex = cssColorToHex(c);
              return hex ?? c;
            });
          }
        }
      });
    }

    // value labels (bars)
    const valueLabelsOn =
      !isPieLike &&
      (((opts.plugins as any).valueLabel?.display) ||
        (typeof unit === 'string' && unit.includes('%')));
    (opts.plugins as any).valueLabel = {
      ...((opts.plugins as any).valueLabel ?? {}),
      display: valueLabelsOn,
      unit,
      color: (opts.plugins as any)?.valueLabel?.color ?? '#374151',
      fontSize: (opts.plugins as any)?.valueLabel?.fontSize ?? 12,
      padding: (opts.plugins as any)?.valueLabel?.padding ?? 6,
    };

    // center value (donut/pie)
    const centerOn = isPieLike && (((opts.plugins as any).centerLabel?.display) || (typeof unit === 'string' && unit.includes('%')));
    (opts.plugins as any).centerLabel = {
      ...((opts.plugins as any).centerLabel ?? {}),
      display: centerOn,
      unit,
      percent: (opts.plugins as any)?.centerLabel?.percent ?? true,
      useMax: (opts.plugins as any)?.centerLabel?.useMax ?? false,
    };

    // side label (donut/pie)
    const sideCfg = (opts.plugins as any).sideLabel ?? {};
    const sideOn = isPieLike && (sideCfg.display ?? true);
    const offset = sideCfg.offset ?? 18;
    const desiredMax = sideCfg.maxWidth ?? 280;
    (opts.plugins as any).sideLabel = { ...sideCfg, display: sideOn, maxWidth: desiredMax, offset };

    if (isPieLike && sideOn) {
      const desiredRightPad = desiredMax + offset + 16;
      opts.layout = opts.layout ?? {};
      const prev = (opts.layout.padding ?? {}) as any;
      opts.layout.padding = { ...prev, right: Math.max(prev?.right ?? 0, desiredRightPad) };
    }

    chartRef.current?.destroy();
    chartRef.current = new Chart(canvas, {
      type: effectiveType as any,
      data: dataObj,
      options: opts,
      plugins: [valueLabelPlugin, centerLabelPlugin, sideLabelPlugin],
    });

    return () => chartRef.current?.destroy();
  }, [chartType, data, options, unit]);

  return (
    <figure className="my-6">
      <div style={{ height }}>
        <canvas ref={canvasRef} />
      </div>
      {caption && <figcaption className="mt-2 text-sm text-gray-600">{caption}</figcaption>}
    </figure>
  );
}










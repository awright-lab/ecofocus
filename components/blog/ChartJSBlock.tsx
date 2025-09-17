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
} from 'chart.js';

// Register once
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
  // CMS aliases we normalize below:
  | 'area' | 'donut';

type NormalizedChartKind =
  | 'bar' | 'line' | 'pie' | 'doughnut'
  | 'radar' | 'polarArea' | 'scatter' | 'bubble';

type Props = {
  chartType: ChartKind;
  // CMS provides a standard Chart.js "data" object
  data: any;        // { labels, datasets }
  options?: any;    // Chart.js options
  height?: number;  // px
  caption?: string;
  unit?: string;    // optional unit suffix for numeric axis
};

function safeParse<T = any>(v: any): T | undefined {
  if (v == null) return undefined;
  if (typeof v === 'string') {
    try { return JSON.parse(v) as T; } catch { return undefined; }
  }
  return v as T;
}

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

    // Parse props (support JSON strings from CMS) and deep-clone to avoid mutating props
    const parsedData = safeParse<any>(data);
    const parsedOptions = safeParse<any>(options) ?? {};
    if (!parsedData) return;

    const dataObj = JSON.parse(JSON.stringify(parsedData));
    const opts: any = JSON.parse(JSON.stringify(parsedOptions));

    // ---------- Normalize chart type ----------
    const effectiveType: NormalizedChartKind =
      chartType === 'donut' ? 'doughnut'
      : chartType === 'area' ? 'line'
      : (chartType as NormalizedChartKind);

    // ---------- Orientation helpers (bars only) ----------
    // Allow CMS to set either options.indexAxis OR a simpler options.orientation = 'row'|'column'
    if (effectiveType === 'bar') {
      const orientation = typeof opts.orientation === 'string' ? opts.orientation : undefined;
      if (opts.indexAxis == null && orientation) {
        opts.indexAxis = orientation === 'row' ? 'y' : 'x';
      }
      if (opts.indexAxis == null) opts.indexAxis = 'x'; // default vertical
    }

    // Numeric axis is Y for vertical bars/lines; X for horizontal bars
    const numericAxisKey: 'x' | 'y' =
      effectiveType === 'bar' && opts.indexAxis === 'y' ? 'x' : 'y';

    // ---------- Rounded corners (bar charts only) ----------
    // Prefer a global elements.bar.borderRadius or custom top-level barRadius; default to 8
    const globalBarRadius =
      opts?.elements?.bar?.borderRadius ??
      (typeof opts?.barRadius === 'number' ? opts.barRadius : undefined);

    if (effectiveType === 'bar' && Array.isArray(dataObj.datasets)) {
      for (const ds of dataObj.datasets) {
        // Respect mixed charts (only touch bar datasets)
        if (ds.type && ds.type !== 'bar') continue;
        if (ds.borderRadius == null) ds.borderRadius = globalBarRadius ?? 8;
        if (ds.borderSkipped == null) ds.borderSkipped = false;
      }
    }

    // ---------- Area support (line with fill) ----------
    if (chartType === 'area' && Array.isArray(dataObj.datasets)) {
      for (const ds of dataObj.datasets) {
        if (ds.type && ds.type !== 'line') continue;
        if (ds.fill == null) ds.fill = true;
        if (ds.tension == null) ds.tension = 0.3; // optional smoothing
      }
      opts.elements = opts.elements ?? {};
      opts.elements.line = { ...(opts.elements.line ?? {}), fill: true };
    }

    // ---------- Dim (or remove) gridlines by default ----------
    const faint = 'rgba(0,0,0,0.08)';
    opts.scales = opts.scales ?? {};
    for (const ax of ['x', 'y'] as const) {
      opts.scales[ax] = opts.scales[ax] ?? {};
      const grid = opts.scales[ax].grid = opts.scales[ax].grid ?? {};
      // If user explicitly set display:false in CMS, honor it and don't force color/border
      if (grid.display !== false) {
        if (grid.color == null) grid.color = faint;
        if (grid.drawBorder == null) grid.drawBorder = false;
      }
      // Gentle tick color unless CMS overrides
      const ticks = opts.scales[ax].ticks = opts.scales[ax].ticks ?? {};
      if (ticks.color == null) ticks.color = 'rgba(0,0,0,0.45)';
    }

    // Sensible defaults unless CMS overrides
    if (opts.responsive == null) opts.responsive = true;
    if (opts.maintainAspectRatio == null) opts.maintainAspectRatio = false;
    opts.plugins = opts.plugins ?? {};
    if (opts.plugins.legend == null) {
      opts.plugins.legend = { display: true, position: 'top' };
    }

    // Tooltip: append unit unless author already supplied callbacks.label
    opts.plugins.tooltip = opts.plugins.tooltip ?? {};
    const hasCustomTooltipLabel = !!opts.plugins.tooltip?.callbacks?.label;
    if (unit && !hasCustomTooltipLabel) {
      opts.plugins.tooltip.callbacks = opts.plugins.tooltip.callbacks ?? {};
      opts.plugins.tooltip.callbacks.label = (ctx: any) => {
        const base = ctx.dataset?.label ? `${ctx.dataset.label}: ` : '';
        return `${base}${ctx.formattedValue}${unit ? ` ${unit}` : ''}`;
      };
    }

    // ---------- Unit suffix on the numeric axis ----------
    if (unit) {
      const axis = opts.scales[numericAxisKey] = opts.scales[numericAxisKey] ?? {};
      axis.ticks = axis.ticks ?? {};
      if (axis.ticks.callback == null) {
        axis.ticks.callback = (value: any) => `${value} ${unit}`;
      }
    }

    // Clean up previous instance
    chartRef.current?.destroy();
    chartRef.current = new Chart(canvas, {
      type: effectiveType as any,
      data: dataObj,
      options: opts,
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


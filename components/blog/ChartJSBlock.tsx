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

type Props = {
  chartType:
    | 'bar' | 'line' | 'pie' | 'doughnut'
    | 'radar' | 'polarArea' | 'scatter' | 'bubble';
  // CMS provides standard Chart.js data object
  data: any;       // { labels, datasets }
  options?: any;   // Chart.js options
  height?: number; // px
  caption?: string;
  unit?: string;   // optional unit suffix for numeric axis
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
    const opts = JSON.parse(JSON.stringify(parsedOptions));

    // Determine orientation (CMS can set opts.indexAxis = 'y' for horizontal bars)
    const indexAxis: 'x' | 'y' = (opts.indexAxis === 'y' ? 'y' : 'x');
    // Numeric axis is Y for vertical bars, X for horizontal bars
    const numericAxisKey = (chartType === 'bar' && indexAxis === 'y') ? 'x' : 'y';

    // ---------- Rounded corners (bar charts only) ----------
    if (chartType === 'bar' && Array.isArray(dataObj.datasets)) {
      for (const ds of dataObj.datasets) {
        // Respect mixed charts (only touch bar datasets)
        if (ds.type && ds.type !== 'bar') continue;
        if (ds.borderRadius == null) ds.borderRadius = 8;
        if (ds.borderSkipped == null) ds.borderSkipped = false;
      }
    }

    // ---------- Dim (or remove) gridlines ----------
    const faint = 'rgba(0,0,0,0.08)';
    opts.scales = opts.scales ?? {};
    for (const ax of ['x', 'y'] as const) {
      opts.scales[ax] = opts.scales[ax] ?? {};
      const grid = opts.scales[ax].grid = opts.scales[ax].grid ?? {};
      // If user explicitly set display:false in CMS, honor it and don't force color.
      if (grid.display !== false) {
        if (grid.color == null) grid.color = faint;
        if (grid.drawBorder == null) grid.drawBorder = false;
      }
      // Gentle tick color unless CMS overrides
      const ticks = opts.scales[ax].ticks = opts.scales[ax].ticks ?? {};
      if (ticks.color == null) ticks.color = 'rgba(0,0,0,0.45)';
    }

    // Pass indexAxis through (affects bar orientation). CMS can set this too.
    if (opts.indexAxis == null && chartType === 'bar') {
      opts.indexAxis = indexAxis; // default to vertical; set 'y' in CMS for horizontal bars
    }

    // Make sure these sensible defaults are on unless CMS overrides
    if (opts.responsive == null) opts.responsive = true;
    if (opts.maintainAspectRatio == null) opts.maintainAspectRatio = false;

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
      type: chartType as any,
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

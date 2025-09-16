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
  // Expect the CMS to provide a standard Chart.js data object
  data: any;       // { labels, datasets }
  options?: any;   // Chart.js options
  height?: number; // px
  caption?: string;
};

export default function ChartJSBlock({ chartType, data, options, height = 360, caption }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !data) return;
    // Allow CMS to send JSON strings
    const parsedData = typeof data === 'string' ? (() => { try { return JSON.parse(data); } catch { return null; } })() : data;
    const parsedOptions = typeof options === 'string' ? (() => { try { return JSON.parse(options); } catch { return undefined; } })() : options;
    if (!parsedData) return;
    // Clean up previous instance
    chartRef.current?.destroy();
    chartRef.current = new Chart(canvasRef.current, {
      type: chartType as any,
      data: parsedData,
      options: parsedOptions,
    });
    return () => chartRef.current?.destroy();
  }, [chartType, data, options]);

  return (
    <figure className="my-6">
      <div style={{ height }}>
        <canvas ref={canvasRef} />
      </div>
      {caption && <figcaption className="mt-2 text-sm text-gray-600">{caption}</figcaption>}
    </figure>
  );
}

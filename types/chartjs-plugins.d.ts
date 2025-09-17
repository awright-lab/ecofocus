// src/types/chartjs-plugins.d.ts
import 'chart.js';

declare module 'chart.js' {
  // Options for your custom plugins
  interface ValueLabelOptions {
    display?: boolean;
    unit?: string;
    color?: string;
    fontSize?: number;
    padding?: number;
  }

  interface SoftShadowOptions {
    color?: string;
    blur?: number;
    offsetX?: number;
    offsetY?: number;
  }

  // Teach Chart.js that these plugin IDs exist in the options bag
  // (This merges with the library's own declaration.)
  interface PluginOptionsByType<TType extends ChartType = ChartType> {
    valueLabel?: ValueLabelOptions;
    softShadow?: SoftShadowOptions;
  }
}

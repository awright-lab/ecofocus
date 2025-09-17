import type { ChartType, ChartData, ChartOptions } from 'chart.js'

type YFieldSpec = { field: string }

export type CMSChartBlock = {
  blockType: 'chartJS'
  chartType: 'bar' | 'line' | 'area' | 'pie' | 'donut' | 'scatter'
  xField: string
  yFields: YFieldSpec[]
  seriesLabelField?: string
  dataSource: {
    dataset?: { data?: any[] } | string | number
    inlineData?: any[]
  }
  stacked?: boolean
  legend?: boolean
  unit?: string
  height?: number
  xLabel?: string
  yLabel?: string
  colorPalette?: { color: string }[]
}

const DEFAULT_COLORS = [
  '#2E7D32',
  '#1E88E5',
  '#D81B60',
  '#F4511E',
  '#6D4C41',
  '#8E24AA',
  '#43A047',
  '#3949AB',
]

const withAlpha = (hex: string, alpha: number): string => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!m) return hex
  const r = parseInt(m[1], 16)
  const g = parseInt(m[2], 16)
  const b = parseInt(m[3], 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const toNumberOr = (v: any, fallback: number): number => {
  const n = typeof v === 'number' ? v : Number(v)
  return Number.isFinite(n) ? n : fallback
}

const uniqueInOrder = <T,>(arr: T[]): T[] => {
  const seen = new Set<string>()
  const out: T[] = []
  for (const v of arr) {
    const key = String(v as any)
    if (!seen.has(key)) {
      seen.add(key)
      out.push(v)
    }
  }
  return out
}

function mapChartType(t: CMSChartBlock['chartType']): ChartType {
  switch (t) {
    case 'donut':
      return 'doughnut'
    case 'area':
      return 'line'
    default:
      return t as ChartType
  }
}

export function buildChartFromBlock(block: CMSChartBlock): {
  type: ChartType
  data: ChartData
  options: ChartOptions
  height?: number
} {
  const type = mapChartType(block.chartType)
  const rows = Array.isArray((block.dataSource as any)?.dataset?.data)
    ? ((block.dataSource as any).dataset.data as any[])
    : Array.isArray(block.dataSource?.inlineData)
    ? (block.dataSource!.inlineData as any[])
    : []

  const yFields = (block.yFields || []).map((f) => f?.field).filter(Boolean) as string[]
  const hasSeries = !!block.seriesLabelField
  const palette = (block.colorPalette || []).map((c) => c.color).filter(Boolean)
  const colors = palette.length > 0 ? palette : DEFAULT_COLORS

  const isPieLike = type === 'pie' || type === 'doughnut'
  const isLineLike = block.chartType === 'area' || type === 'line'

  let data: ChartData

  if (isPieLike) {
    if (hasSeries) {
      const series = uniqueInOrder(rows.map((r) => r[block.seriesLabelField!]))
      const firstY = yFields[0]
      const values = series.map((s) =>
        rows
          .filter((r) => r[block.seriesLabelField!] === s)
          .reduce((sum, r) => sum + toNumberOr(r[firstY], 0), 0)
      )

      data = {
        labels: series as any,
        datasets: [
          {
            label: firstY,
            data: values,
            backgroundColor: series.map((_, i) => withAlpha(colors[i % colors.length], 0.8)),
            borderColor: series.map((_, i) => colors[i % colors.length]),
          },
        ],
      }
    } else {
      const labels = uniqueInOrder(rows.map((r) => r[block.xField]))
      const firstY = yFields[0]
      const values = labels.map((x) => {
        const rs = rows.filter((r) => r[block.xField] === x)
        return rs.length ? toNumberOr(rs[0][firstY], 0) : 0
      })
      data = {
        labels: labels as any,
        datasets: [
          {
            label: firstY,
            data: values,
            backgroundColor: labels.map((_, i) => withAlpha(colors[i % colors.length], 0.8)),
            borderColor: labels.map((_, i) => colors[i % colors.length]),
          },
        ],
      }
    }
  } else if (type === 'scatter') {
    if (hasSeries) {
      const series = uniqueInOrder(rows.map((r) => r[block.seriesLabelField!]))
      const datasets = [] as any[]
      series.forEach((s, si) => {
        yFields.forEach((yf, yi) => {
          const pts = rows
            .filter((r) => r[block.seriesLabelField!] === s)
            .map((r, idx) => ({ x: toNumberOr(r[block.xField], idx), y: toNumberOr(r[yf], 0) }))
          const color = colors[(si * yFields.length + yi) % colors.length]
          datasets.push({
            label: yFields.length > 1 ? `${s} — ${yf}` : String(s),
            data: pts,
            borderColor: color,
            backgroundColor: withAlpha(color, 0.2),
            showLine: false,
          })
        })
      })
      data = { datasets }
    } else {
      const datasets = yFields.map((yf, i) => {
        const pts = rows.map((r, idx) => ({ x: toNumberOr(r[block.xField], idx), y: toNumberOr(r[yf], 0) }))
        const color = colors[i % colors.length]
        return {
          label: yf,
          data: pts,
          borderColor: color,
          backgroundColor: withAlpha(color, 0.2),
          showLine: false,
        }
      })
      data = { datasets }
    }
  } else {
    // bar / line / area
    const xLabels = uniqueInOrder(rows.map((r) => r[block.xField]))
    const datasets = [] as any[]

    if (hasSeries) {
      const series = uniqueInOrder(rows.map((r) => r[block.seriesLabelField!]))
      series.forEach((s, si) => {
        yFields.forEach((yf, yi) => {
          const vals = xLabels.map((x) => {
            const rs = rows.filter((r) => r[block.xField] === x && r[block.seriesLabelField!] === s)
            if (rs.length === 0) return null
            const sum = rs.reduce((acc, r) => acc + toNumberOr(r[yf], 0), 0)
            return Number.isFinite(sum) ? sum : null
          })
          const color = colors[(si * yFields.length + yi) % colors.length]
          datasets.push({
            label: yFields.length > 1 ? `${s} — ${yf}` : String(s),
            data: vals,
            borderColor: color,
            backgroundColor: withAlpha(color, isLineLike ? 0.2 : 0.5),
            fill: isLineLike ? true : undefined,
            tension: isLineLike ? 0.25 : undefined,
          })
        })
      })
    } else {
      yFields.forEach((yf, i) => {
        const vals = xLabels.map((x) => {
          const rs = rows.filter((r) => r[block.xField] === x)
          if (rs.length === 0) return null
          const sum = rs.reduce((acc, r) => acc + toNumberOr(r[yf], 0), 0)
          return Number.isFinite(sum) ? sum : null
        })
        const color = colors[i % colors.length]
        datasets.push({
          label: yf,
          data: vals,
          borderColor: color,
          backgroundColor: withAlpha(color, isLineLike ? 0.2 : 0.5),
          fill: isLineLike ? true : undefined,
          tension: isLineLike ? 0.25 : undefined,
        })
      })
    }

    data = { labels: xLabels as any, datasets }
  }

  const options: ChartOptions = {}

  // Legend
  options.plugins = {
    ...options.plugins,
    legend: { display: block.legend !== false },
  }

  // Scales for cartesian types
  if (!isPieLike) {
    options.scales = {
      x: {
        stacked: !!block.stacked,
        title: block.xLabel ? { display: true, text: block.xLabel } : undefined,
      },
      y: {
        stacked: !!block.stacked,
        title: block.yLabel ? { display: true, text: block.yLabel } : undefined,
        // Do not include function callbacks here (breaks RSC). Unit is applied in client ChartJSBlock.
      },
    }
  }

  return { type, data, options, height: block.height }
}

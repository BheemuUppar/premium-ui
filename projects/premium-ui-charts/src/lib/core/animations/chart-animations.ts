/** Default entry animation duration (ms) for full-size charts. */
export const PUI_DEFAULT_CHART_ANIMATION_DURATION = 900;

/** Shared animation presets — all charts reuse the same motion language. */
export interface PuiChartAnimationPreset {
  readonly animationDuration: number;
  readonly animationEasing: string;
  readonly animationDelay?: number;
  readonly animationDurationUpdate?: number;
  readonly animationEasingUpdate?: string;
}

export const PUI_CHART_ANIMATIONS = {
  fade: {
    animationDuration: PUI_DEFAULT_CHART_ANIMATION_DURATION,
    animationEasing: 'cubicOut',
    animationDurationUpdate: 550,
    animationEasingUpdate: 'cubicInOut',
  },
  grow: {
    animationDuration: 800,
    animationEasing: 'elasticOut',
    animationDurationUpdate: 400,
    animationEasingUpdate: 'cubicOut',
  },
  hoverLift: {
    animationDuration: 200,
    animationEasing: 'cubicOut',
    animationDurationUpdate: 180,
    animationEasingUpdate: 'cubicOut',
  },
  tooltipAppear: {
    animationDuration: 180,
    animationEasing: 'cubicOut',
    animationDurationUpdate: 120,
    animationEasingUpdate: 'cubicOut',
  },
  seriesFocus: {
    animationDuration: 250,
    animationEasing: 'cubicInOut',
    animationDurationUpdate: 200,
    animationEasingUpdate: 'cubicInOut',
  },
} as const satisfies Readonly<Record<string, PuiChartAnimationPreset>>;

export type PuiChartAnimationName = keyof typeof PUI_CHART_ANIMATIONS;

export function resolveChartAnimation(
  preset: PuiChartAnimationName = 'fade'
): PuiChartAnimationPreset {
  return PUI_CHART_ANIMATIONS[preset];
}

/** Premium emphasis — hovered series pops, others dim. */
export const PUI_CHART_EMPHASIS_STYLE = {
  focus: 'series' as const,
  blurScope: 'coordinateSystem' as const,
  scale: true,
  scaleSize: 6,
};

export const PUI_CHART_BLUR_STYLE = {
  itemStyle: { opacity: 0.25 },
  lineStyle: { opacity: 0.2 },
  areaStyle: { opacity: 0.08 },
};

export const PUI_CHART_EMPHASIS_ITEM = {
  itemStyle: { opacity: 1, shadowBlur: 12, shadowColor: 'rgba(15, 23, 42, 0.12)' },
  lineStyle: { width: 3 },
  scale: true,
};

import { Injectable, inject } from '@angular/core';
import { getLocalTimeZone } from '@internationalized/date';
import type {
  PuiCalendarDateParts,
  PuiDateConfig,
  PuiDateRangePreset,
  PuiDateRangeValue,
  PuiDateValue,
} from '../../interfaces/date.types';
import {
  buildCalendarGrid,
  buildRangePresets,
  coerceDateValue,
  formatDateParts,
  getLocaleFirstDayOfWeek,
  getMonthLabels,
  getQuarterFromMonth,
  getQuarterLabel,
  getWeekdayLabels,
  parseDateInput,
  shiftMonth,
  type PuiCalendarCell,
  type PuiCalendarGridOptions,
} from '../adapters/calendar-date.adapter';

export interface PuiMergedDateConfig extends Required<
  Pick<
    PuiDateConfig,
    | 'locale'
    | 'timezone'
    | 'format'
    | 'selectionMode'
    | 'fiscalYearStartMonth'
    | 'showWeekNumbers'
    | 'hourCycle'
    | 'showSeconds'
    | 'appearance'
    | 'size'
    | 'outputType'
    | 'mode'
  >
> {
  readonly min?: PuiDateValue;
  readonly max?: PuiDateValue;
  readonly presets?: boolean | readonly PuiDateRangePreset[];
  readonly disabledDates?: (date: PuiCalendarDateParts) => boolean;
  readonly firstDayOfWeek: number;
  readonly placeholder?: string;
  readonly readonly?: boolean;
  readonly required?: boolean;
  readonly mobileSheet?: boolean;
  readonly showFooter?: boolean;
  readonly confirmOnApply?: boolean;
  readonly allowClear?: boolean;
}

const DEFAULT_CONFIG: PuiMergedDateConfig = {
  locale: 'en-US',
  timezone: getLocalTimeZone(),
  format: 'MM/dd/yyyy',
  selectionMode: 'single',
  mode: 'date',
  outputType: 'parts',
  fiscalYearStartMonth: 1,
  showWeekNumbers: false,
  hourCycle: 12,
  showSeconds: false,
  appearance: 'outline',
  size: 'md',
  firstDayOfWeek: 0,
  showFooter: false,
  confirmOnApply: false,
};

export function mergeDateConfig(config?: PuiDateConfig): PuiMergedDateConfig {
  const locale = config?.locale ?? DEFAULT_CONFIG.locale;
  return {
    ...DEFAULT_CONFIG,
    ...config,
    locale,
    timezone: config?.timezone ?? DEFAULT_CONFIG.timezone,
    format: config?.format ?? resolveDefaultFormat(locale),
    firstDayOfWeek: config?.firstDayOfWeek ?? getLocaleFirstDayOfWeek(locale),
  };
}

function resolveDefaultFormat(locale: string): string {
  if (locale === 'en-IN' || locale === 'en-GB' || locale === 'de-DE' || locale === 'fr-FR') {
    return 'dd/MM/yyyy';
  }
  if (locale === 'ja-JP' || locale === 'zh-CN') {
    return 'yyyy-MM-dd';
  }
  return 'MM/dd/yyyy';
}

@Injectable({ providedIn: 'root' })
export class PuiDateEngineService {
  mergeConfig(config?: PuiDateConfig): PuiMergedDateConfig {
    return mergeDateConfig(config);
  }

  coerceValue(value: unknown): PuiDateValue {
    return coerceDateValue(value);
  }

  format(value: PuiDateValue, config?: PuiDateConfig): string {
    const merged = mergeDateConfig(config);
    return formatDateParts(value, merged.format, merged.locale);
  }

  parse(input: string, config?: PuiDateConfig): PuiDateValue {
    const merged = mergeDateConfig(config);
    return parseDateInput(input, merged.format, merged.locale);
  }

  buildGrid(options: PuiCalendarGridOptions): readonly PuiCalendarCell[] {
    return buildCalendarGrid(options);
  }

  getWeekdays(config?: PuiDateConfig): readonly string[] {
    const merged = mergeDateConfig(config);
    return getWeekdayLabels(merged.locale, merged.firstDayOfWeek);
  }

  getMonths(config?: PuiDateConfig): readonly string[] {
    const merged = mergeDateConfig(config);
    return getMonthLabels(merged.locale);
  }

  getPresets(config?: PuiDateConfig): readonly PuiDateRangePreset[] {
    const merged = mergeDateConfig(config);
    if (merged.presets === false) {
      return [];
    }
    if (Array.isArray(merged.presets)) {
      return merged.presets;
    }
    return buildRangePresets(merged.locale, merged.timezone);
  }

  shiftMonth(year: number, month: number, delta: number) {
    return shiftMonth(year, month, delta);
  }

  getQuarterLabel(year: number, quarter: 1 | 2 | 3 | 4): string {
    return getQuarterLabel(year, quarter);
  }

  getQuarterFromMonth(month: number, fiscalStartMonth = 1): 1 | 2 | 3 | 4 {
    return getQuarterFromMonth(month, fiscalStartMonth);
  }

  isDisabled(date: PuiCalendarDateParts, config?: PuiDateConfig): boolean {
    const merged = mergeDateConfig(config);
    if (merged.min != null || merged.max != null) {
      const value = coerceDateValue(date);
      if (value == null) {
        return true;
      }
      const current = coerceDateValue(value)!;
      if (merged.min != null && compareParts(current, merged.min) < 0) {
        return true;
      }
      if (merged.max != null && compareParts(current, merged.max) > 0) {
        return true;
      }
    }
    return merged.disabledDates?.(date) ?? false;
  }
}

function compareParts(a: PuiCalendarDateParts, b: PuiCalendarDateParts): number {
  if (a.year !== b.year) return a.year - b.year;
  if (a.month !== b.month) return a.month - b.month;
  return a.day - b.day;
}

export function injectDateEngine(): PuiDateEngineService {
  return inject(PuiDateEngineService);
}

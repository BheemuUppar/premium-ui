import type { PuiSize } from '../utils/size.types';

export type PuiDateAppearance = 'outline' | 'filled' | 'soft';
export type PuiDateSelectionMode = 'single' | 'range' | 'multiple';
export type PuiDateSize = PuiSize;

export type PuiDateMode =
  | 'date'
  | 'datetime'
  | 'time'
  | 'month'
  | 'year'
  | 'quarter'
  | 'range'
  | 'calendar';

export type PuiDateOutputType = 'date' | 'timestamp' | 'iso' | 'parts';

/** Serializable calendar date (timezone-neutral). */
export interface PuiCalendarDateParts {
  readonly year: number;
  readonly month: number;
  readonly day: number;
}

/** Serializable date-time parts. */
export interface PuiCalendarDateTimeParts extends PuiCalendarDateParts {
  readonly hour: number;
  readonly minute: number;
  readonly second: number;
}

export type PuiDateValue = PuiCalendarDateParts | null;
export type PuiDateTimeValue = PuiCalendarDateTimeParts | null;

export interface PuiDateRangeValue {
  readonly start: PuiDateValue;
  readonly end: PuiDateValue;
}

export interface PuiQuarterValue {
  readonly quarter: 1 | 2 | 3 | 4;
  readonly year: number;
}

export type PuiDatePickerValue = PuiDateValue | PuiDateRangeValue | readonly PuiCalendarDateParts[];

export interface PuiDateRangePreset {
  readonly id: string;
  readonly label: string;
  readonly range: PuiDateRangeValue;
}

export interface PuiDateConfig {
  readonly mode?: PuiDateMode;
  readonly outputType?: PuiDateOutputType;
  readonly locale?: string;
  readonly timezone?: string;
  readonly format?: string;
  readonly selectionMode?: PuiDateSelectionMode;
  readonly min?: PuiDateValue;
  readonly max?: PuiDateValue;
  readonly presets?: boolean | readonly PuiDateRangePreset[];
  readonly fiscalYearStartMonth?: number;
  readonly firstDayOfWeek?: number;
  readonly showWeekNumbers?: boolean;
  readonly disabledDates?: (date: PuiCalendarDateParts) => boolean;
  readonly hourCycle?: 12 | 24;
  readonly showSeconds?: boolean;
  readonly appearance?: PuiDateAppearance;
  readonly size?: PuiDateSize;
  readonly placeholder?: string;
  readonly readonly?: boolean;
  readonly required?: boolean;
  readonly mobileSheet?: boolean;
  readonly showFooter?: boolean;
  readonly confirmOnApply?: boolean;
  readonly allowClear?: boolean;
}

export interface PuiDatePickerConfig extends PuiDateConfig {
  readonly mode?: 'date' | 'calendar';
  readonly selectionMode?: 'single' | 'multiple';
}

export interface PuiDateRangePickerConfig extends PuiDateConfig {
  readonly mode?: 'range';
  readonly selectionMode?: 'range';
  readonly monthsVisible?: 1 | 2;
}

export interface PuiDateTimePickerConfig extends PuiDateConfig {
  readonly mode?: 'datetime';
  readonly showSeconds?: boolean;
  readonly hourCycle?: 12 | 24;
}

export interface PuiTimePickerConfig extends Pick<
  PuiDateConfig,
  'locale' | 'timezone' | 'hourCycle' | 'showSeconds' | 'appearance' | 'size' | 'placeholder' | 'readonly' | 'required' | 'outputType'
> {
  readonly mode?: 'time';
}

export interface PuiMonthPickerConfig extends Pick<
  PuiDateConfig,
  'locale' | 'min' | 'max' | 'appearance' | 'size' | 'placeholder' | 'readonly' | 'required' | 'fiscalYearStartMonth' | 'outputType'
> {
  readonly mode?: 'month';
}

export interface PuiYearPickerConfig extends Pick<
  PuiDateConfig,
  'locale' | 'min' | 'max' | 'appearance' | 'size' | 'placeholder' | 'readonly' | 'required' | 'outputType'
> {
  readonly mode?: 'year';
}

export interface PuiQuarterPickerConfig extends Pick<
  PuiDateConfig,
  'locale' | 'min' | 'max' | 'appearance' | 'size' | 'placeholder' | 'readonly' | 'required' | 'fiscalYearStartMonth' | 'outputType'
> {
  readonly mode?: 'quarter';
}

export interface PuiCalendarConfig extends PuiDateConfig {
  readonly mode?: 'calendar' | 'date' | 'range';
  readonly inline?: boolean;
}

export type PuiDateEmittedValue =
  | Date
  | number
  | string
  | PuiDateRangeOutput
  | PuiDateTimeOutput
  | PuiQuarterValue
  | PuiCalendarDateParts
  | PuiCalendarDateTimeParts
  | PuiDateRangeValue
  | Record<string, unknown>
  | null;

export interface PuiDateRangeOutput {
  readonly startDate: Date | number | string | PuiCalendarDateParts | null;
  readonly endDate: Date | number | string | PuiCalendarDateParts | null;
}

export interface PuiDateTimeOutput {
  readonly date: string;
  readonly time: string;
  readonly timezone?: string;
}

export interface PuiDateValueChange<T = PuiDateEmittedValue> {
  readonly value: T;
}

export interface PuiDateSelectionChange<T = PuiDateEmittedValue> {
  readonly value: T;
}

export interface PuiDateRangeChange<T = PuiDateRangeOutput> {
  readonly range: T;
  readonly start: PuiDateValue;
  readonly end: PuiDateValue;
}

export interface PuiDateMonthChange {
  readonly year: number;
  readonly month: number;
}

export interface PuiDateYearChange {
  readonly year: number;
}

export interface PuiDateOpenChange {
  readonly opened: boolean;
}

export interface PuiDateFocusChange {
  readonly focused: boolean;
}

import {
  CalendarDate,
  CalendarDateTime,
  endOfMonth,
  isSameDay,
  isSameMonth,
  isToday,
  parseDate,
  startOfMonth,
  startOfWeek,
  today,
} from '@internationalized/date';
import type {
  PuiCalendarDateParts,
  PuiCalendarDateTimeParts,
  PuiDateRangePreset,
  PuiDateRangeValue,
  PuiDateValue,
} from '../../interfaces/date.types';

export const PUI_SUPPORTED_LOCALES = [
  'en-US',
  'en-IN',
  'en-GB',
  'fr-FR',
  'de-DE',
  'ja-JP',
  'zh-CN',
] as const;

export type PuiSupportedLocale = (typeof PUI_SUPPORTED_LOCALES)[number];

export function toCalendarDateParts(date: CalendarDate): PuiCalendarDateParts {
  return { year: date.year, month: date.month, day: date.day };
}

export function toCalendarDateTimeParts(date: CalendarDateTime): PuiCalendarDateTimeParts {
  return {
    year: date.year,
    month: date.month,
    day: date.day,
    hour: date.hour,
    minute: date.minute,
    second: date.second,
  };
}

export function fromDateParts(parts: PuiCalendarDateParts | null | undefined): CalendarDate | null {
  if (parts == null) {
    return null;
  }
  return new CalendarDate(parts.year, parts.month, parts.day);
}

export function fromDateTimeParts(parts: PuiCalendarDateTimeParts | null | undefined): CalendarDateTime | null {
  if (parts == null) {
    return null;
  }
  return new CalendarDateTime(parts.year, parts.month, parts.day, parts.hour, parts.minute, parts.second);
}

export function coerceDateValue(value: unknown): PuiDateValue {
  if (value == null || value === '') {
    return null;
  }
  if (value instanceof CalendarDate) {
    return toCalendarDateParts(value);
  }
  if (value instanceof Date) {
    return { year: value.getFullYear(), month: value.getMonth() + 1, day: value.getDate() };
  }
  if (typeof value === 'string') {
    try {
      const parsed = parseDate(value);
      return toCalendarDateParts(parsed);
    } catch {
      return null;
    }
  }
  if (typeof value === 'object' && value !== null && 'year' in value && 'month' in value && 'day' in value) {
    const record = value as PuiCalendarDateParts;
    return { year: record.year, month: record.month, day: record.day };
  }
  return null;
}

export function compareDateParts(a: PuiCalendarDateParts, b: PuiCalendarDateParts): number {
  const left = fromDateParts(a);
  const right = fromDateParts(b);
  if (left == null || right == null) {
    return 0;
  }
  return left.compare(right);
}

export function isDateInRange(
  date: PuiCalendarDateParts,
  min: PuiDateValue | undefined,
  max: PuiDateValue | undefined
): boolean {
  const current = fromDateParts(date);
  if (current == null) {
    return false;
  }
  if (min != null) {
    const minDate = fromDateParts(min);
    if (minDate != null && current.compare(minDate) < 0) {
      return false;
    }
  }
  if (max != null) {
    const maxDate = fromDateParts(max);
    if (maxDate != null && current.compare(maxDate) > 0) {
      return false;
    }
  }
  return true;
}

export function getLocaleFirstDayOfWeek(locale: string): number {
  try {
    const localeData = new Intl.Locale(locale);
    const weekInfo = (localeData as Intl.Locale & { weekInfo?: { firstDay?: number } }).weekInfo;
    if (weekInfo?.firstDay != null) {
      return weekInfo.firstDay === 7 ? 0 : weekInfo.firstDay;
    }
  } catch {
    // fall through
  }
  return locale.startsWith('en-US') ? 0 : 1;
}

export function getWeekdayLabels(locale: string, firstDayOfWeek: number): readonly string[] {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  const labels: string[] = [];
  const base = new Date(Date.UTC(2024, 0, 7 + firstDayOfWeek));
  for (let index = 0; index < 7; index += 1) {
    const date = new Date(base);
    date.setUTCDate(base.getUTCDate() + index);
    labels.push(formatter.format(date));
  }
  return labels;
}

export function getMonthLabels(locale: string): readonly string[] {
  const formatter = new Intl.DateTimeFormat(locale, { month: 'short' });
  return Array.from({ length: 12 }, (_, index) => formatter.format(new Date(Date.UTC(2024, index, 1))));
}

export interface PuiCalendarCell {
  readonly date: PuiCalendarDateParts;
  readonly iso: string;
  readonly label: string;
  readonly isCurrentMonth: boolean;
  readonly isToday: boolean;
  readonly isSelected: boolean;
  readonly isInRange: boolean;
  readonly isInPreview: boolean;
  readonly isRangeStart: boolean;
  readonly isRangeEnd: boolean;
  readonly isDisabled: boolean;
}

export interface PuiCalendarGridOptions {
  readonly locale: string;
  readonly year: number;
  readonly month: number;
  readonly firstDayOfWeek?: number;
  readonly selected?: PuiDateValue | PuiDateRangeValue | readonly PuiCalendarDateParts[];
  readonly selectionMode?: 'single' | 'range' | 'multiple';
  readonly rangePreviewEnd?: PuiDateValue;
  readonly min?: PuiDateValue;
  readonly max?: PuiDateValue;
  readonly disabledDates?: (date: PuiCalendarDateParts) => boolean;
}

export function buildCalendarGrid(options: PuiCalendarGridOptions): readonly PuiCalendarCell[] {
  const firstDay = options.firstDayOfWeek ?? getLocaleFirstDayOfWeek(options.locale);
  const focus = new CalendarDate(options.year, options.month, 1);
  const monthStart = startOfMonth(focus);
  const gridStart = startOfWeek(monthStart, localeToCalendarLocale(options.locale, firstDay));
  const cells: PuiCalendarCell[] = [];
  let cursor = gridStart;

  for (let index = 0; index < 42; index += 1) {
    const parts = toCalendarDateParts(cursor);
    const disabled =
      !isDateInRange(parts, options.min, options.max) ||
      (options.disabledDates?.(parts) ?? false);
    cells.push({
      date: parts,
      iso: cursor.toString(),
      label: String(parts.day),
      isCurrentMonth: isSameMonth(cursor, focus),
      isToday: isToday(cursor, 'UTC'),
      isSelected: isCellSelected(parts, options.selected, options.selectionMode),
      isInRange: isCellInRange(parts, options.selected, options.selectionMode),
      isInPreview: isCellInPreview(parts, options.selected, options.selectionMode, options.rangePreviewEnd),
      isRangeStart: isRangeEdge(parts, options.selected, 'start') || isPreviewEdge(parts, options.selected, options.rangePreviewEnd, 'start'),
      isRangeEnd: isRangeEdge(parts, options.selected, 'end') || isPreviewEdge(parts, options.selected, options.rangePreviewEnd, 'end'),
      isDisabled: disabled,
    });
    cursor = cursor.add({ days: 1 });
  }

  return cells;
}

function localeToCalendarLocale(locale: string, firstDayOfWeek: number): string {
  return `${locale}-u-fw-${firstDayOfWeek === 0 ? 'sun' : 'mon'}`;
}

function isCellSelected(
  parts: PuiCalendarDateParts,
  selected: PuiCalendarGridOptions['selected'],
  mode: PuiCalendarGridOptions['selectionMode']
): boolean {
  if (selected == null) {
    return false;
  }
  const date = fromDateParts(parts);
  if (date == null) {
    return false;
  }
  if (mode === 'multiple' && Array.isArray(selected)) {
    return selected.some((item) => isSameDay(fromDateParts(item)!, date));
  }
  if (mode === 'range' && !Array.isArray(selected) && 'start' in selected) {
    const range = selected as PuiDateRangeValue;
    return (
      (range.start != null && isSameDay(fromDateParts(range.start)!, date)) ||
      (range.end != null && isSameDay(fromDateParts(range.end)!, date))
    );
  }
  if (!Array.isArray(selected) && selected != null && !('start' in selected)) {
    return isSameDay(fromDateParts(selected as PuiDateValue)!, date);
  }
  return false;
}

function isCellInRange(
  parts: PuiCalendarDateParts,
  selected: PuiCalendarGridOptions['selected'],
  mode: PuiCalendarGridOptions['selectionMode']
): boolean {
  if (mode !== 'range' || selected == null || Array.isArray(selected) || !('start' in selected)) {
    return false;
  }
  const range = selected as PuiDateRangeValue;
  if (range.start == null || range.end == null) {
    return false;
  }
  const current = fromDateParts(parts)!;
  const start = fromDateParts(range.start)!;
  const end = fromDateParts(range.end)!;
  return current.compare(start) >= 0 && current.compare(end) <= 0;
}

function isRangeEdge(
  parts: PuiCalendarDateParts,
  selected: PuiCalendarGridOptions['selected'],
  edge: 'start' | 'end'
): boolean {
  if (selected == null || Array.isArray(selected) || !('start' in selected)) {
    return false;
  }
  const range = selected as PuiDateRangeValue;
  const target = edge === 'start' ? range.start : range.end;
  if (target == null) {
    return false;
  }
  return isSameDay(fromDateParts(parts)!, fromDateParts(target)!);
}

function isCellInPreview(
  parts: PuiCalendarDateParts,
  selected: PuiCalendarGridOptions['selected'],
  mode: PuiCalendarGridOptions['selectionMode'],
  previewEnd: PuiDateValue | undefined
): boolean {
  if (mode !== 'range' || previewEnd == null || selected == null || Array.isArray(selected) || !('start' in selected)) {
    return false;
  }
  const range = selected as PuiDateRangeValue;
  if (range.start == null || range.end != null) {
    return false;
  }
  const current = fromDateParts(parts)!;
  const start = fromDateParts(range.start)!;
  const end = fromDateParts(previewEnd)!;
  const [left, right] = start.compare(end) <= 0 ? [start, end] : [end, start];
  return current.compare(left) >= 0 && current.compare(right) <= 0;
}

function isPreviewEdge(
  parts: PuiCalendarDateParts,
  selected: PuiCalendarGridOptions['selected'],
  previewEnd: PuiDateValue | undefined,
  edge: 'start' | 'end'
): boolean {
  if (previewEnd == null || selected == null || Array.isArray(selected) || !('start' in selected)) {
    return false;
  }
  const range = selected as PuiDateRangeValue;
  if (range.start == null || range.end != null) {
    return false;
  }
  const target = edge === 'start' ? range.start : previewEnd;
  if (target == null) {
    return false;
  }
  return isSameDay(fromDateParts(parts)!, fromDateParts(target)!);
}

export function shiftMonth(year: number, month: number, delta: number): { year: number; month: number } {
  const date = new CalendarDate(year, month, 1).add({ months: delta });
  return { year: date.year, month: date.month };
}

export function formatDateParts(
  parts: PuiCalendarDateParts | null,
  format: string,
  locale: string
): string {
  if (parts == null) {
    return '';
  }
  const date = fromDateParts(parts);
  if (date == null) {
    return '';
  }
  const jsDate = new Date(date.year, date.month - 1, date.day);
  if (format === 'yyyy-MM-dd') {
    return date.toString();
  }
  if (format === 'dd/MM/yyyy') {
    return `${pad(parts.day)}/${pad(parts.month)}/${parts.year}`;
  }
  if (format === 'MM/dd/yyyy') {
    return `${pad(parts.month)}/${pad(parts.day)}/${parts.year}`;
  }
  if (format === 'dd MMM yyyy') {
    return new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'short', year: 'numeric' }).format(jsDate);
  }
  return new Intl.DateTimeFormat(locale).format(jsDate);
}

export function parseDateInput(value: string, format: string, locale: string): PuiDateValue {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  if (format === 'yyyy-MM-dd' || /^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    try {
      return toCalendarDateParts(parseDate(trimmed));
    } catch {
      return null;
    }
  }
  if (format === 'dd/MM/yyyy' || (locale === 'en-IN' || locale === 'en-GB')) {
    const match = trimmed.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2,4})$/);
    if (match) {
      const day = Number(match[1]);
      const month = Number(match[2]);
      const year = normalizeYear(Number(match[3]));
      return { year, month, day };
    }
  }
  if (format === 'MM/dd/yyyy' || locale === 'en-US') {
    const match = trimmed.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2,4})$/);
    if (match) {
      const month = Number(match[1]);
      const day = Number(match[2]);
      const year = normalizeYear(Number(match[3]));
      return { year, month, day };
    }
  }
  const parsed = Date.parse(trimmed);
  if (!Number.isNaN(parsed)) {
    const date = new Date(parsed);
    return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
  }
  return null;
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function normalizeYear(value: number): number {
  if (value >= 100) {
    return value;
  }
  return value + 2000;
}

export function buildRangePresets(_locale: string, timezone = 'UTC'): readonly PuiDateRangePreset[] {
  const anchor = today(timezone);
  const yesterday = anchor.subtract({ days: 1 });
  const last7 = anchor.subtract({ days: 6 });
  const last30 = anchor.subtract({ days: 29 });
  const monthStart = startOfMonth(anchor);
  const prevMonthEnd = monthStart.subtract({ days: 1 });
  const prevMonthStart = startOfMonth(prevMonthEnd);
  const quarter = Math.floor((anchor.month - 1) / 3);
  const thisQuarterStart = new CalendarDate(anchor.year, quarter * 3 + 1, 1);
  const lastQuarterEnd = thisQuarterStart.subtract({ days: 1 });
  const lastQuarterStartMonth = lastQuarterEnd.month - ((lastQuarterEnd.month - 1) % 3);
  const lastQuarterStart = new CalendarDate(lastQuarterEnd.year, lastQuarterStartMonth, 1);
  const thisYearStart = new CalendarDate(anchor.year, 1, 1);
  const lastYearStart = new CalendarDate(anchor.year - 1, 1, 1);
  const lastYearEnd = new CalendarDate(anchor.year - 1, 12, 31);

  return [
    { id: 'today', label: 'Today', range: { start: toCalendarDateParts(anchor), end: toCalendarDateParts(anchor) } },
    { id: 'yesterday', label: 'Yesterday', range: { start: toCalendarDateParts(yesterday), end: toCalendarDateParts(yesterday) } },
    { id: 'last-7-days', label: 'Last 7 Days', range: { start: toCalendarDateParts(last7), end: toCalendarDateParts(anchor) } },
    { id: 'last-30-days', label: 'Last 30 Days', range: { start: toCalendarDateParts(last30), end: toCalendarDateParts(anchor) } },
    { id: 'this-month', label: 'This Month', range: { start: toCalendarDateParts(monthStart), end: toCalendarDateParts(endOfMonth(anchor)) } },
    { id: 'last-month', label: 'Last Month', range: { start: toCalendarDateParts(prevMonthStart), end: toCalendarDateParts(prevMonthEnd) } },
    { id: 'this-quarter', label: 'This Quarter', range: { start: toCalendarDateParts(thisQuarterStart), end: toCalendarDateParts(endOfMonth(anchor)) } },
    { id: 'last-quarter', label: 'Last Quarter', range: { start: toCalendarDateParts(lastQuarterStart), end: toCalendarDateParts(lastQuarterEnd) } },
    { id: 'this-year', label: 'This Year', range: { start: toCalendarDateParts(thisYearStart), end: toCalendarDateParts(anchor) } },
    { id: 'last-year', label: 'Last Year', range: { start: toCalendarDateParts(lastYearStart), end: toCalendarDateParts(lastYearEnd) } },
  ];
}

export function getQuarterLabel(year: number, quarter: 1 | 2 | 3 | 4): string {
  return `Q${quarter} ${year}`;
}

export function getQuarterFromMonth(month: number, fiscalStartMonth = 1): 1 | 2 | 3 | 4 {
  const offset = (month - fiscalStartMonth + 12) % 12;
  return (Math.floor(offset / 3) + 1) as 1 | 2 | 3 | 4;
}

export type { CalendarDate, CalendarDateTime } from '@internationalized/date';

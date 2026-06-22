import type {
  PuiCalendarDateParts,
  PuiDateEmittedValue,
  PuiDateMode,
  PuiDateOutputType,
  PuiDateRangeValue,
  PuiDateValue,
  PuiQuarterValue,
} from '../../interfaces/date.types';
import { fromDateParts, fromDateTimeParts } from '../adapters/calendar-date.adapter';

export function serializeDateOutput(
  value: PuiDateValue,
  outputType: PuiDateOutputType,
  _timezone?: string
): PuiDateEmittedValue {
  if (value == null) {
    return null;
  }
  if (outputType === 'parts') {
    return value;
  }
  const calendarDate = fromDateParts(value);
  if (calendarDate == null) {
    return null;
  }
  const jsDate = new Date(calendarDate.year, calendarDate.month - 1, calendarDate.day);
  switch (outputType) {
    case 'timestamp':
      return jsDate.getTime();
    case 'iso':
      return jsDate.toISOString();
    case 'date':
    default:
      return jsDate;
  }
}

export function serializeRangeOutput(
  range: PuiDateRangeValue,
  outputType: PuiDateOutputType
): PuiDateEmittedValue {
  if (outputType === 'parts') {
    return range;
  }
  return {
    startDate: serializeDateOutput(range.start, outputType),
    endDate: serializeDateOutput(range.end, outputType),
  };
}

export function serializeDateTimeOutput(
  value: { readonly date: PuiDateValue; readonly hour: number; readonly minute: number; readonly second: number },
  timezone?: string
): PuiDateEmittedValue {
  const date = value.date;
  const dateStr = date ? `${date.year}-${pad(date.month)}-${pad(date.day)}` : '';
  const timeStr = `${pad(value.hour)}:${pad(value.minute)}${value.second ? `:${pad(value.second)}` : ''}`;
  return {
    date: dateStr,
    time: timeStr,
    ...(timezone ? { timezone } : {}),
  };
}

export function resolveEmittedValue(
  mode: PuiDateMode,
  internal: unknown,
  outputType: PuiDateOutputType,
  timezone?: string
): PuiDateEmittedValue {
  switch (mode) {
    case 'range':
      return serializeRangeOutput((internal as PuiDateRangeValue) ?? { start: null, end: null }, outputType);
    case 'datetime': {
      const record = internal as { date: PuiDateValue; hour: number; minute: number; second: number };
      if (outputType === 'iso' || outputType === 'timestamp' || outputType === 'date') {
        const parts = record.date;
        if (parts == null) {
          return null;
        }
        const dt = fromDateTimeParts({
          ...parts,
          hour: record.hour,
          minute: record.minute,
          second: record.second,
        });
        if (dt == null) {
          return null;
        }
        const jsDate = new Date(dt.year, dt.month - 1, dt.day, dt.hour, dt.minute, dt.second);
        if (outputType === 'timestamp') {
          return jsDate.getTime();
        }
        if (outputType === 'iso') {
          return jsDate.toISOString();
        }
        return jsDate;
      }
      return serializeDateTimeOutput(record, timezone);
    }
    case 'quarter':
      return (internal as PuiQuarterValue | null) ?? null;
    case 'time':
      return internal as PuiDateEmittedValue;
    case 'month':
    case 'year':
    case 'date':
    case 'calendar':
    default:
      return serializeDateOutput(internal as PuiDateValue, outputType, timezone);
  }
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

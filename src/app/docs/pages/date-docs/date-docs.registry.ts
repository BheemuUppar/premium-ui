import type { PuiDocCodeTab } from '../../docs.types';
import { buildHtmlTsTabs } from '../../shared';

const DATE = { name: 'PuiDatePickerComponent', path: '@premium-ui/date' } as const;
const DATE_RANGE = { name: 'PuiDateRangePickerComponent', path: '@premium-ui/date' } as const;
const CALENDAR = { name: 'PuiCalendarComponent', path: '@premium-ui/date' } as const;
const DATETIME = { name: 'PuiDateTimePickerComponent', path: '@premium-ui/date' } as const;
const TIME = { name: 'PuiTimePickerComponent', path: '@premium-ui/date' } as const;
const MONTH = { name: 'PuiMonthPickerComponent', path: '@premium-ui/date' } as const;
const YEAR = { name: 'PuiYearPickerComponent', path: '@premium-ui/date' } as const;
const QUARTER = { name: 'PuiQuarterPickerComponent', path: '@premium-ui/date' } as const;

export interface PuiDateDocExample {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly tabs: readonly PuiDocCodeTab[];
}

export const DATE_DOC_EXAMPLES: readonly PuiDateDocExample[] = [
  {
    id: 'date-basic',
    title: 'Basic date picker',
    description: 'Default US locale. Opens on input or calendar icon click; closes on selection.',
    tabs: buildHtmlTsTabs(`<pui-date-picker [config]="config" [(value)]="selectedDate" />`, {
      selector: 'app-basic-date',
      componentClass: 'BasicDateComponent',
      imports: [DATE],
      members: [
        `protected readonly config = { locale: 'en-US', format: 'MM/dd/yyyy' };`,
        `protected selectedDate = { year: 2026, month: 6, day: 8 };`,
      ],
    }),
  },
  {
    id: 'date-locale',
    title: 'Locale & format',
    description: 'Switch locale and display format for regional date entry.',
    tabs: buildHtmlTsTabs(`<pui-date-picker [config]="config" [(value)]="selectedDate" />`, {
      selector: 'app-locale-date',
      componentClass: 'LocaleDateComponent',
      imports: [DATE],
      members: [
        `protected readonly config = { locale: 'en-IN', format: 'dd/MM/yyyy', timezone: 'Asia/Kolkata' };`,
        `protected selectedDate = { year: 2026, month: 6, day: 8 };`,
      ],
    }),
  },
  {
    id: 'date-output-type',
    title: 'Output type',
    description: 'Control the shape of puiValueChange with outputType: parts | date | timestamp | iso.',
    tabs: buildHtmlTsTabs(
      `<pui-date-picker [config]="config" [(value)]="selectedDate" (puiValueChange)="onValueChange($event)" />`,
      {
        selector: 'app-output-date',
        componentClass: 'OutputDateComponent',
        imports: [DATE],
        members: [
          `protected readonly config = { locale: 'en-US', outputType: 'iso' as const };`,
          `protected selectedDate = { year: 2026, month: 6, day: 22 };`,
          `protected onValueChange(value: string | Date | number): void { /* handle emitted value */ }`,
        ],
      }
    ),
  },
  {
    id: 'date-allow-clear',
    title: 'Allow clear',
    description: 'Show a clear button only when allowClear is true (default is false).',
    tabs: buildHtmlTsTabs(`<pui-date-picker [config]="config" [(value)]="selectedDate" />`, {
      selector: 'app-clearable-date',
      componentClass: 'ClearableDateComponent',
      imports: [DATE],
      members: [
        `protected readonly config = { locale: 'en-US', allowClear: true };`,
        `protected selectedDate = { year: 2026, month: 6, day: 8 };`,
      ],
    }),
  },
  {
    id: 'date-range',
    title: 'Date range picker',
    description: 'Dual calendars with presets. Range commits when start and end are both selected.',
    tabs: buildHtmlTsTabs(`<pui-date-range-picker [config]="config" [(value)]="range" />`, {
      selector: 'app-date-range',
      componentClass: 'DateRangeComponent',
      imports: [DATE_RANGE],
      members: [
        `protected readonly config = { locale: 'en-US', presets: true, monthsVisible: 2 };`,
        `protected range = { start: { year: 2026, month: 6, day: 1 }, end: { year: 2026, month: 6, day: 30 } };`,
      ],
    }),
  },
  {
    id: 'date-range-footer',
    title: 'Range with Apply footer',
    description: 'Defer commit until the user clicks Apply (showFooter or confirmOnApply).',
    tabs: buildHtmlTsTabs(`<pui-date-range-picker [config]="config" [(value)]="range" />`, {
      selector: 'app-date-range-footer',
      componentClass: 'DateRangeFooterComponent',
      imports: [DATE_RANGE],
      members: [
        `protected readonly config = { locale: 'en-US', presets: true, showFooter: true };`,
        `protected range = { start: null, end: null };`,
      ],
    }),
  },
  {
    id: 'calendar-inline',
    title: 'Inline calendar',
    description: 'Embed the calendar directly without a popup input.',
    tabs: buildHtmlTsTabs(`<pui-calendar [config]="config" [(value)]="selectedDate" />`, {
      selector: 'app-inline-calendar',
      componentClass: 'InlineCalendarComponent',
      imports: [CALENDAR],
      members: [
        `protected readonly config = { locale: 'en-US', selectionMode: 'single' as const };`,
        `protected selectedDate = { year: 2026, month: 6, day: 8 };`,
      ],
    }),
  },
  {
    id: 'datetime',
    title: 'Date & time',
    description: 'Combined date and time selection with 12h or 24h hour cycle.',
    tabs: buildHtmlTsTabs(`<pui-datetime-picker [config]="config" [(value)]="dateTime" />`, {
      selector: 'app-datetime',
      componentClass: 'DateTimeComponent',
      imports: [DATETIME],
      members: [
        `protected readonly config = { locale: 'en-US', hourCycle: 12 as const, timezone: 'Asia/Kolkata' };`,
        `protected dateTime = { year: 2026, month: 6, day: 22, hour: 21, minute: 45, second: 0 };`,
      ],
    }),
  },
  {
    id: 'time',
    title: 'Time picker',
    description: 'Standalone time columns with optional seconds and AM/PM.',
    tabs: buildHtmlTsTabs(`<pui-time-picker [config]="config" [(value)]="time" />`, {
      selector: 'app-time',
      componentClass: 'TimeComponent',
      imports: [TIME],
      members: [
        `protected readonly config = { hourCycle: 12 as const, showSeconds: false };`,
        `protected time = { hour: 21, minute: 45, second: 0, period: 'PM' as const };`,
      ],
    }),
  },
  {
    id: 'month-year-quarter',
    title: 'Month, year & quarter',
    description: 'Compact pickers for reporting and analytics filters.',
    tabs: buildHtmlTsTabs(
      `<pui-month-picker [config]="monthConfig" [(value)]="month" />
<pui-year-picker [config]="yearConfig" [(value)]="year" />
<pui-quarter-picker [(value)]="quarter" />`,
      {
        selector: 'app-period-pickers',
        componentClass: 'PeriodPickersComponent',
        imports: [MONTH, YEAR, QUARTER],
        members: [
          `protected readonly monthConfig = { locale: 'en-US' };`,
          `protected readonly yearConfig = { locale: 'en-US' };`,
          `protected month = 6;`,
          `protected year = 2026;`,
          `protected quarter = { quarter: 2 as const, year: 2026 };`,
        ],
      }
    ),
  },
  {
    id: 'reactive-form',
    title: 'Reactive forms',
    description: 'Bind with formControlName or [formControl] — same config object applies.',
    tabs: buildHtmlTsTabs(
      `<form [formGroup]="form">
  <pui-date-picker formControlName="startDate" [config]="config" />
</form>`,
      {
        selector: 'app-reactive-date',
        componentClass: 'ReactiveDateComponent',
        imports: [DATE],
        members: [
          `protected readonly config = { locale: 'en-IN', format: 'dd/MM/yyyy' };`,
          `protected readonly form = new FormGroup({ startDate: new FormControl({ year: 2026, month: 1, day: 15 }) });`,
        ],
        injects: [{ name: 'FormGroup', path: '@angular/forms' }, { name: 'FormControl', path: '@angular/forms' }],
      }
    ),
  },
  {
    id: 'min-max',
    title: 'Min & max dates',
    description: 'Restrict selectable dates with min and max bounds.',
    tabs: buildHtmlTsTabs(`<pui-date-picker [config]="config" [(value)]="selectedDate" />`, {
      selector: 'app-bounded-date',
      componentClass: 'BoundedDateComponent',
      imports: [DATE],
      members: [
        `protected readonly config = {
  locale: 'en-US',
  min: { year: 2026, month: 1, day: 1 },
  max: { year: 2026, month: 12, day: 31 },
};`,
        `protected selectedDate = { year: 2026, month: 6, day: 8 };`,
      ],
    }),
  },
];

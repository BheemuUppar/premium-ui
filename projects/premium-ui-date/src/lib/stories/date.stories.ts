import type { Meta, StoryObj } from '@storybook/angular';
import { Component, signal } from '@angular/core';
import { PuiCalendarComponent } from '../components/calendar';
import { PuiDatePickerComponent } from '../components/date-picker';
import { PuiDateRangePickerComponent } from '../components/date-range-picker';
import { PuiMonthPickerComponent } from '../components/month-picker';
import { PuiTimePickerComponent } from '../components/time-picker';
import type { PuiDateRangeValue, PuiDateValue } from '../interfaces';

@Component({
  selector: 'pui-date-story-host',
  imports: [
    PuiDatePickerComponent,
    PuiDateRangePickerComponent,
    PuiCalendarComponent,
    PuiTimePickerComponent,
    PuiMonthPickerComponent,
  ],
  template: `
    <div style="display:grid;gap:1.5rem;max-width:960px">
      <pui-date-picker [value]="date()" (valueChange)="date.set($event)" [config]="{ locale: 'en-US' }" />
      <pui-date-range-picker [value]="range()" (valueChange)="range.set($event)" [config]="{ locale: 'en-US', presets: true }" />
      <pui-calendar [config]="{ locale: 'en-US' }" [value]="date()" (valueChange)="date.set($event)" />
      <pui-time-picker [config]="{ hourCycle: 24 }" />
      <pui-month-picker [config]="{ locale: 'en-US' }" />
    </div>
  `,
})
class DateStoryHostComponent {
  readonly date = signal<PuiDateValue>({ year: 2026, month: 6, day: 8 });
  readonly range = signal<PuiDateRangeValue>({ start: { year: 2026, month: 6, day: 1 }, end: { year: 2026, month: 6, day: 8 } });
}

const meta: Meta = {
  title: 'Date/Platform',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  render: () => ({
    moduleMetadata: { imports: [DateStoryHostComponent] },
    template: `<pui-date-story-host />`,
  }),
};

export const Localization: Story = {
  name: 'Localization (en-IN)',
  render: () => ({
    moduleMetadata: { imports: [PuiDatePickerComponent] },
    template: `<pui-date-picker [config]="{ locale: 'en-IN', format: 'dd/MM/yyyy', timezone: 'Asia/Kolkata' }" />`,
  }),
};

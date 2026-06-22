import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { map } from 'rxjs';
import {
  PuiCalendarComponent,
  PuiDatePickerComponent,
  PuiDateRangePickerComponent,
  PuiDateTimePickerComponent,
  PuiMonthPickerComponent,
  PuiQuarterPickerComponent,
  PuiTimePickerComponent,
  PuiYearPickerComponent,
  type PuiTimeParts,
  type PuiDateOutputType,
  type PuiDatePickerConfig,
  type PuiDateRangeValue,
  type PuiDateValue,
  type PuiQuarterValue,
} from '@premium-ui/date';
import type { PuiDocApiRow, PuiDocA11yItem, PuiDocsTab } from '../../docs.types';
import {
  PuiDocApiTableComponent,
  PuiDocA11yListComponent,
  PuiDocExampleComponent,
  PuiDocInstallationComponent,
  toSelectOptions,
} from '../../shared';
import { PuiSelectComponent } from '../../../../premium-ui/components/select';
import type { PuiSelectValue } from '../../../../premium-ui/components/select/select.types';
import { useDocsPageSeo } from '../../seo/use-docs-page-seo';
import { DATE_DOC_EXAMPLES } from './date-docs.registry';

type PuiDocsDateTab = 'overview' | 'examples' | 'api' | 'accessibility' | 'playground';

@Component({
  selector: 'app-date-docs',
  imports: [
    PuiDatePickerComponent,
    PuiDateRangePickerComponent,
    PuiCalendarComponent,
    PuiDateTimePickerComponent,
    PuiTimePickerComponent,
    PuiMonthPickerComponent,
    PuiYearPickerComponent,
    PuiQuarterPickerComponent,
    PuiSelectComponent,
    ReactiveFormsModule,
    PuiDocApiTableComponent,
    PuiDocA11yListComponent,
    PuiDocExampleComponent,
    PuiDocInstallationComponent,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './date-docs.component.html',
  styleUrl: './date-docs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateDocsComponent {
  private readonly route = inject(ActivatedRoute);

  private readonly routeTab = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('tab') ?? 'overview')),
    { initialValue: 'overview' }
  );

  protected readonly examples = DATE_DOC_EXAMPLES;

  protected readonly currentTab = computed((): PuiDocsDateTab => {
    const tab = this.routeTab();
    return tab === 'examples' || tab === 'api' || tab === 'accessibility' || tab === 'playground' ? tab : 'overview';
  });

  protected readonly tabs: readonly PuiDocsTab[] = [
    { label: 'Overview', route: ['/docs/components/date/overview'] },
    { label: 'Examples', route: ['/docs/components/date/examples'] },
    { label: 'API', route: ['/docs/components/date/api'] },
    { label: 'Accessibility', route: ['/docs/components/date/accessibility'] },
    { label: 'Playground', route: ['/docs/components/date/playground'] },
  ];

  protected readonly dateValue = signal<PuiDateValue>({ year: 2026, month: 6, day: 8 });
  protected readonly localeDateValue = signal<PuiDateValue>({ year: 2026, month: 6, day: 8 });
  protected readonly clearableDateValue = signal<PuiDateValue>({ year: 2026, month: 6, day: 8 });
  protected readonly outputTypeDateValue = signal<PuiDateValue>({ year: 2026, month: 6, day: 22 });
  protected readonly boundedDateValue = signal<PuiDateValue>({ year: 2026, month: 6, day: 8 });
  protected readonly rangeValue = signal<PuiDateRangeValue>({
    start: { year: 2026, month: 6, day: 1 },
    end: { year: 2026, month: 6, day: 30 },
  });
  protected readonly rangeFooterValue = signal<PuiDateRangeValue>({ start: null, end: null });
  protected readonly monthValue = signal<number | null>(6);
  protected readonly yearValue = signal<number | null>(2026);
  protected readonly quarterValue = signal<PuiQuarterValue | null>({ quarter: 2, year: 2026 });
  protected readonly timeValue = signal<PuiTimeParts>({ hour: 21, minute: 45, second: 0, period: 'PM' });
  protected readonly reactiveControl = new FormControl<PuiDateValue>({ year: 2026, month: 1, day: 15 });

  protected readonly playgroundLocale = signal('en-US');
  protected readonly playgroundOutputType = signal<PuiDateOutputType>('parts');
  protected readonly playgroundAllowClear = signal(false);
  protected readonly playgroundValue = signal<PuiDateValue>({ year: 2026, month: 6, day: 8 });

  protected readonly localeOptions = toSelectOptions(['en-US', 'en-IN', 'en-GB', 'fr-FR', 'de-DE', 'ja-JP', 'zh-CN']);
  protected readonly outputTypeOptions = toSelectOptions(['parts', 'date', 'timestamp', 'iso']);
  protected readonly booleanOptions = toSelectOptions(['false', 'true']);

  protected readonly playgroundConfig = computed(
    (): PuiDatePickerConfig => ({
      locale: this.playgroundLocale(),
      format: this.playgroundLocale() === 'en-US' ? 'MM/dd/yyyy' : 'dd/MM/yyyy',
      timezone: this.playgroundLocale() === 'en-IN' ? 'Asia/Kolkata' : undefined,
      outputType: this.playgroundOutputType(),
      allowClear: this.playgroundAllowClear(),
    })
  );

  protected readonly playgroundConfigSnippet = computed(() =>
    JSON.stringify(
      {
        locale: this.playgroundLocale(),
        format: this.playgroundLocale() === 'en-US' ? 'MM/dd/yyyy' : 'dd/MM/yyyy',
        ...(this.playgroundLocale() === 'en-IN' ? { timezone: 'Asia/Kolkata' } : {}),
        outputType: this.playgroundOutputType(),
        allowClear: this.playgroundAllowClear(),
      },
      null,
      2
    )
  );

  protected readonly configApiRows: readonly PuiDocApiRow[] = [
    { name: 'mode', type: 'date | datetime | time | month | year | quarter | range | calendar', defaultValue: 'date', description: 'Picker mode — calendar UI adapts automatically.' },
    { name: 'outputType', type: 'date | timestamp | iso | parts', defaultValue: 'parts', description: 'Shape emitted by puiValueChange.' },
    { name: 'allowClear', type: 'boolean', defaultValue: 'false', description: 'Show clear button when a value is selected.' },
    { name: 'locale', type: 'string', defaultValue: 'en-US', description: 'BCP 47 locale for formatting and first day of week.' },
    { name: 'timezone', type: 'string', defaultValue: 'local', description: 'IANA timezone for presets and datetime values.' },
    { name: 'format', type: 'string', defaultValue: 'locale default', description: 'Display and parse format.' },
    { name: 'presets', type: 'boolean | PuiDateRangePreset[]', defaultValue: 'false', description: 'Analytics range shortcuts.' },
    { name: 'showFooter', type: 'boolean', defaultValue: 'false', description: 'Cancel / Apply footer for range picker.' },
    { name: 'mobileSheet', type: 'boolean', defaultValue: 'false', description: 'Bottom sheet overlay on mobile viewports.' },
  ];

  protected readonly outputApiRows: readonly PuiDocApiRow[] = [
    { name: 'puiValueChange', type: 'PuiDateEmittedValue', defaultValue: '—', description: 'Emits serialized value based on outputType.' },
    { name: 'puiSelectionChange', type: 'PuiDateEmittedValue', defaultValue: '—', description: 'Emits when user confirms a selection.' },
    { name: 'puiRangeChange', type: 'PuiDateRangeChange', defaultValue: '—', description: 'Range picker range + start/end parts.' },
    { name: 'puiOpened / puiClosed', type: 'void', defaultValue: '—', description: 'Overlay lifecycle events.' },
  ];

  protected readonly componentApiRows: readonly PuiDocApiRow[] = [
    { name: 'pui-date-picker', type: 'component', defaultValue: '—', description: 'Single date input with popup calendar.' },
    { name: 'pui-date-range-picker', type: 'component', defaultValue: '—', description: 'Presets + dual month calendars with hover preview.' },
    { name: 'pui-datetime-picker', type: 'component', defaultValue: '—', description: 'Combined date and time selection.' },
    { name: 'pui-time-picker', type: 'component', defaultValue: '—', description: '12h/24h scrollable columns.' },
    { name: 'pui-month-picker', type: 'component', defaultValue: '—', description: 'Month grid for reporting filters.' },
    { name: 'pui-year-picker', type: 'component', defaultValue: '—', description: 'Paginated year grid.' },
    { name: 'pui-quarter-picker', type: 'component', defaultValue: '—', description: 'Quarter selection for dashboards.' },
    { name: 'pui-calendar', type: 'component', defaultValue: '—', description: 'Inline calendar — single, range, or multiple.' },
  ];

  protected readonly a11yItems: readonly PuiDocA11yItem[] = [
    { title: 'Keyboard navigation', description: 'Arrow keys, Home/End, Page Up/Down, Enter/Space to select, Escape closes overlay.' },
    { title: 'Outside interaction', description: 'Backdrop click, Escape, and Tab away close the popup and restore input focus.' },
    { title: 'ARIA', description: 'Calendar grid uses role="grid"; inputs expose aria-expanded and aria-haspopup="dialog".' },
    { title: 'Range preview', description: 'Hover preview highlights tentative ranges before the second click finalizes selection.' },
  ];

  constructor() {
    useDocsPageSeo({ slug: 'date', tab: this.currentTab });
  }

  protected setPlaygroundLocale(value: PuiSelectValue): void {
    if (typeof value === 'string') {
      this.playgroundLocale.set(value);
    }
  }

  protected setPlaygroundOutputType(value: PuiSelectValue): void {
    if (value === 'parts' || value === 'date' || value === 'timestamp' || value === 'iso') {
      this.playgroundOutputType.set(value);
    }
  }

  protected setPlaygroundAllowClear(value: PuiSelectValue): void {
    this.playgroundAllowClear.set(value === 'true');
  }

  protected readonly configExample = `const config: PuiDateConfig = {
  locale: 'en-IN',
  format: 'dd/MM/yyyy',
  timezone: 'Asia/Kolkata',
  outputType: 'iso',
  allowClear: false,
  presets: true,
  monthsVisible: 2,
};`;
}

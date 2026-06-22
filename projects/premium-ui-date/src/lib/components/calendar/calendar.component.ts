import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { today } from '@internationalized/date';
import type { PuiMergedDateConfig } from '../../core/services/date-engine.service';
import type { PuiCalendarDateParts, PuiDateConfig, PuiDateRangeValue, PuiDateValue } from '../../interfaces/date.types';
import { compareDateParts } from '../../core/adapters/calendar-date.adapter';
import { PuiDateEngineService } from '../../core/services/date-engine.service';
import { PuiDateIconComponent } from '../date-icon/date-icon.component';

@Component({
  selector: 'pui-calendar',
  imports: [PuiDateIconComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'pui-calendar',
    role: 'application',
    '[attr.aria-label]': 'ariaLabel()',
    '(keydown)': 'handleKeydown($event)',
    '(mouseleave)': 'clearHoverPreview()',
  },
})
export class PuiCalendarComponent {
  private readonly engine = inject(PuiDateEngineService);

  readonly config = input<PuiDateConfig | PuiMergedDateConfig>();
  readonly value = input<PuiDateValue | PuiDateRangeValue | readonly PuiCalendarDateParts[] | null>(null);
  readonly monthOffset = input(0);
  readonly baseYear = input<number | null>(null);
  readonly baseMonth = input<number | null>(null);
  readonly ariaLabel = input('Calendar');
  readonly showNavigation = input(true);

  readonly valueChange = output<PuiDateValue>();
  readonly rangeChange = output<PuiDateRangeValue>();
  readonly monthChange = output<{ year: number; month: number }>();

  protected readonly focusedYear = signal(today('UTC').year);
  protected readonly focusedMonth = signal(today('UTC').month);
  protected readonly focusedDay = signal(today('UTC').day);
  protected readonly rangeDraftStart = signal<PuiDateValue>(null);
  protected readonly hoverPreviewEnd = signal<PuiDateValue>(null);

  protected readonly merged = computed(() => this.engine.mergeConfig(this.config()));

  protected readonly displayYear = computed(() => {
    const anchorYear = this.baseYear() ?? this.focusedYear();
    const anchorMonth = this.baseMonth() ?? this.focusedMonth();
    const shifted = this.engine.shiftMonth(anchorYear, anchorMonth, this.monthOffset());
    return shifted.year;
  });

  protected readonly displayMonth = computed(() => {
    const anchorYear = this.baseYear() ?? this.focusedYear();
    const anchorMonth = this.baseMonth() ?? this.focusedMonth();
    const shifted = this.engine.shiftMonth(anchorYear, anchorMonth, this.monthOffset());
    return shifted.month;
  });

  protected readonly weekdays = computed(() => this.engine.getWeekdays(this.config()));

  protected readonly monthLabel = computed(() => {
    const merged = this.merged();
    const date = new Date(this.displayYear(), this.displayMonth() - 1, 1);
    return new Intl.DateTimeFormat(merged.locale, { month: 'long', year: 'numeric' }).format(date);
  });

  protected readonly effectiveRange = computed((): PuiDateRangeValue | null => {
    const current = this.value();
    if (current == null || Array.isArray(current) || !('start' in current)) {
      return null;
    }
    const draft = this.rangeDraftStart();
    if (draft != null) {
      return { start: draft, end: null };
    }
    return current;
  });

  protected readonly cells = computed(() =>
    this.engine.buildGrid({
      locale: this.merged().locale,
      year: this.displayYear(),
      month: this.displayMonth(),
      firstDayOfWeek: this.merged().firstDayOfWeek,
      selected: this.effectiveRange() ?? this.value() ?? undefined,
      selectionMode: this.merged().selectionMode,
      rangePreviewEnd: this.hoverPreviewEnd() ?? undefined,
      min: this.merged().min,
      max: this.merged().max,
      disabledDates: this.merged().disabledDates,
    })
  );

  constructor() {
    effect(() => {
      const current = this.value();
      if (isSingleDateValue(current)) {
        this.focusedYear.set(current.year);
        this.focusedMonth.set(current.month);
        this.focusedDay.set(current.day);
      }
    });
  }

  protected selectDate(parts: PuiCalendarDateParts, disabled: boolean): void {
    if (disabled) {
      return;
    }
    this.focusedYear.set(parts.year);
    this.focusedMonth.set(parts.month);
    this.focusedDay.set(parts.day);
    const mode = this.merged().selectionMode;
    if (mode === 'range') {
      const draft = this.rangeDraftStart();
      const current = this.value();
      const existingStart =
        draft ??
        (current != null && !Array.isArray(current) && 'start' in current ? current.start : null);
      if (existingStart == null || (current != null && !Array.isArray(current) && 'start' in current && current.end != null)) {
        this.rangeDraftStart.set(parts);
        this.hoverPreviewEnd.set(null);
        this.rangeChange.emit({ start: parts, end: null });
        return;
      }
      const ordered =
        compareDateParts(existingStart, parts) <= 0
          ? { start: existingStart, end: parts }
          : { start: parts, end: existingStart };
      this.rangeDraftStart.set(null);
      this.hoverPreviewEnd.set(null);
      this.rangeChange.emit(ordered);
      return;
    }
    this.valueChange.emit(parts);
  }

  protected previewRange(parts: PuiCalendarDateParts, disabled: boolean): void {
    if (disabled || this.merged().selectionMode !== 'range') {
      return;
    }
    const draft = this.rangeDraftStart();
    const current = this.value();
    const hasDraft =
      draft != null ||
      (current != null && !Array.isArray(current) && 'start' in current && current.start != null && current.end == null);
    if (!hasDraft) {
      return;
    }
    this.hoverPreviewEnd.set(parts);
  }

  protected clearHoverPreview(): void {
    this.hoverPreviewEnd.set(null);
  }

  protected previousMonth(): void {
    if (this.monthOffset() !== 0) {
      return;
    }
    const next = this.engine.shiftMonth(this.focusedYear(), this.focusedMonth(), -1);
    this.focusedYear.set(next.year);
    this.focusedMonth.set(next.month);
    this.monthChange.emit(next);
  }

  protected nextMonth(): void {
    if (this.monthOffset() !== 0) {
      return;
    }
    const next = this.engine.shiftMonth(this.focusedYear(), this.focusedMonth(), 1);
    this.focusedYear.set(next.year);
    this.focusedMonth.set(next.month);
    this.monthChange.emit(next);
  }

  protected handleKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.shiftFocus({ days: -1 });
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.shiftFocus({ days: 1 });
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.shiftFocus({ days: -7 });
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.shiftFocus({ days: 7 });
        break;
      case 'PageUp':
        event.preventDefault();
        this.previousMonth();
        break;
      case 'PageDown':
        event.preventDefault();
        this.nextMonth();
        break;
      case 'Home':
        event.preventDefault();
        this.focusedDay.set(1);
        break;
      case 'End': {
        event.preventDefault();
        const lastDay = new Date(this.focusedYear(), this.focusedMonth(), 0).getDate();
        this.focusedDay.set(lastDay);
        break;
      }
      case 'Enter':
      case ' ': {
        event.preventDefault();
        const parts: PuiCalendarDateParts = {
          year: this.focusedYear(),
          month: this.focusedMonth(),
          day: this.focusedDay(),
        };
        const cell = this.cells().find(
          (item) => item.date.year === parts.year && item.date.month === parts.month && item.date.day === parts.day
        );
        if (cell && !cell.isDisabled) {
          this.selectDate(cell.date, false);
        }
        break;
      }
      default:
        break;
    }
  }

  private shiftFocus(delta: { days: number }): void {
    const current = new Date(this.focusedYear(), this.focusedMonth() - 1, this.focusedDay());
    current.setDate(current.getDate() + delta.days);
    this.focusedYear.set(current.getFullYear());
    this.focusedMonth.set(current.getMonth() + 1);
    this.focusedDay.set(current.getDate());
  }
}

function isSingleDateValue(
  value: PuiDateValue | PuiDateRangeValue | readonly PuiCalendarDateParts[] | null
): value is PuiCalendarDateParts {
  return value != null && !Array.isArray(value) && !('start' in value);
}

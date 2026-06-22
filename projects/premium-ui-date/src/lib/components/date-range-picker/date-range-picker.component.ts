import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  TemplateRef,
  ViewContainerRef,
  booleanAttribute,
  computed,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import type {
  PuiDateEmittedValue,
  PuiDateRangeChange,
  PuiDateRangePickerConfig,
  PuiDateRangePreset,
  PuiDateRangeValue,
} from '../../interfaces/date.types';
import { PuiDateCvaBridge, providePuiDateCva } from '../../core/forms/date-cva-bridge';
import { formatDateParts } from '../../core/adapters/calendar-date.adapter';
import { isFocusMovingToOverlay, monitorOverlayFocusDismiss } from '../../core/overlays/date-overlay.focus';
import { PuiDateOverlayController } from '../../core/overlays/date-overlay.controller';
import type { PuiDateOverlayHandle } from '../../core/overlays/date-overlay.adapter';
import { PuiDateEngineService } from '../../core/services/date-engine.service';
import { resolveEmittedValue } from '../../core/value/date-value.serializer';
import { PuiCalendarComponent } from '../calendar/calendar.component';
import { PuiDateIconComponent } from '../date-icon/date-icon.component';

@Component({
  selector: 'pui-date-range-picker',
  imports: [PuiCalendarComponent, PuiDateIconComponent],
  templateUrl: './date-range-picker.component.html',
  styleUrl: './date-range-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [providePuiDateCva(PuiDateRangePickerComponent)],
  host: {
    class: 'pui-date-range-picker',
    '[class.pui-date-range-picker--open]': 'isOpen()',
    '[class.pui-date-range-picker--disabled]': 'isDisabled()',
    '[class.pui-date-range-picker--mobile]': 'merged().mobileSheet',
  },
})
export class PuiDateRangePickerComponent implements ControlValueAccessor {
  private readonly engine = inject(PuiDateEngineService);
  private readonly overlay = inject(PuiDateOverlayController);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly cva = new PuiDateCvaBridge<PuiDateRangeValue>();

  private overlayHandle: PuiDateOverlayHandle | null = null;
  private removeFocusDismiss: (() => void) | null = null;

  readonly config = input<PuiDateRangePickerConfig>();
  readonly value = model<PuiDateRangeValue>({ start: null, end: null });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input<string | null>(null);

  readonly puiRangeChange = output<PuiDateRangeChange>();
  readonly puiValueChange = output<PuiDateEmittedValue>();
  readonly puiOpened = output<void>();
  readonly puiClosed = output<void>();

  protected readonly isOpen = signal(false);
  protected readonly pendingRange = signal<PuiDateRangeValue>({ start: null, end: null });
  protected readonly anchorMonth = signal<{ year: number; month: number } | null>(null);

  private readonly triggerRef = viewChild.required<ElementRef<HTMLElement>>('trigger');
  private readonly inputRef = viewChild.required<ElementRef<HTMLInputElement>>('input');
  private readonly panelTemplate = viewChild.required<TemplateRef<unknown>>('panelTemplate');

  protected readonly merged = computed(() =>
    this.engine.mergeConfig({ ...this.config(), mode: 'range', selectionMode: 'range' })
  );

  protected readonly calendarConfig = computed(() => this.merged());

  protected readonly presets = computed((): readonly PuiDateRangePreset[] => this.engine.getPresets(this.merged()));

  protected readonly showDualMonths = computed(() => (this.config()?.monthsVisible ?? 2) === 2);

  protected readonly showClearButton = computed(() => {
    const range = this.value();
    return (
      this.merged().allowClear === true &&
      !this.isDisabled() &&
      (range.start != null || range.end != null)
    );
  });

  protected readonly displayValue = computed(() => {
    const merged = this.merged();
    const range = this.value();
    if (range.start == null && range.end == null) {
      return '';
    }
    const start = formatDateParts(range.start, merged.format, merged.locale);
    const end = formatDateParts(range.end, merged.format, merged.locale);
    return end ? `${start} – ${end}` : start;
  });

  protected readonly isDisabled = computed(
    () => this.disabled() || this.cva.formDisabled() || this.merged().readonly === true
  );

  writeValue(value: PuiDateRangeValue | null): void {
    this.value.set(value ?? { start: null, end: null });
  }

  registerOnChange(fn: (value: PuiDateRangeValue) => void): void {
    this.cva.registerOnChange(fn);
  }

  registerOnTouched(fn: () => void): void {
    this.cva.registerOnTouched(fn);
  }

  setDisabledState(isDisabled: boolean): void {
    this.cva.setDisabledState(isDisabled);
  }

  protected openPanel(): void {
    if (this.isDisabled() || this.isOpen()) {
      return;
    }

    this.pendingRange.set(this.value());

    this.overlayHandle = this.overlay.open(
      this.triggerRef().nativeElement,
      this.panelTemplate(),
      this.viewContainerRef,
      {
        mobileSheet: this.merged().mobileSheet,
        panelClass: 'pui-date-range-picker__overlay',
        minWidth: this.merged().mobileSheet ? '100%' : '42rem',
        maxWidth: this.merged().mobileSheet ? '100%' : '56rem',
      }
    );

    this.isOpen.set(true);
    this.puiOpened.emit();

    this.removeFocusDismiss = monitorOverlayFocusDismiss({
      trigger: this.triggerRef().nativeElement,
      getPanel: () => this.overlayHandle?.panelElement,
      isOpen: () => this.isOpen(),
      onDismiss: () => this.closePanel(),
    });

    this.overlayHandle.afterClosed$.subscribe(() => {
      this.teardownOverlay();
    });
  }

  protected closePanel(): void {
    if (!this.isOpen()) {
      return;
    }
    this.overlay.close();
  }

  protected clearValue(event: MouseEvent): void {
    event.stopPropagation();
    this.commitRange({ start: null, end: null });
  }

  protected onInputKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closePanel();
      return;
    }
    if (event.key === 'ArrowDown' || event.key === 'Enter') {
      event.preventDefault();
      this.openPanel();
    }
  }

  protected applyPreset(preset: PuiDateRangePreset): void {
    if (this.merged().showFooter || this.merged().confirmOnApply) {
      this.pendingRange.set(preset.range);
      return;
    }
    this.commitRange(preset.range);
    this.closePanel();
  }

  protected onRangeChange(range: PuiDateRangeValue): void {
    this.pendingRange.set(range);
    if (this.merged().showFooter || this.merged().confirmOnApply) {
      return;
    }
    if (range.start != null && range.end != null) {
      this.commitRange(range);
      this.closePanel();
    }
  }

  protected cancelSelection(): void {
    this.pendingRange.set(this.value());
    this.closePanel();
  }

  protected applySelection(): void {
    this.commitRange(this.pendingRange());
    this.closePanel();
  }

  protected onAnchorMonthChange(event: { year: number; month: number }): void {
    this.anchorMonth.set(event);
  }

  private teardownOverlay(): void {
    this.removeFocusDismiss?.();
    this.removeFocusDismiss = null;
    this.overlayHandle = null;

    if (!this.isOpen()) {
      return;
    }

    this.isOpen.set(false);
    this.puiClosed.emit();
    this.cva.markTouched();
    this.inputRef().nativeElement.focus({ preventScroll: true });
  }

  private commitRange(range: PuiDateRangeValue): void {
    this.value.set(range);
    this.cva.emitChange(range);
    const outputType = this.merged().outputType ?? 'parts';
    const emitted = resolveEmittedValue('range', range, outputType, this.merged().timezone);
    this.puiValueChange.emit(emitted);
    this.puiRangeChange.emit({
      range: emitted as PuiDateRangeChange['range'],
      start: range.start,
      end: range.end,
    });
  }
}

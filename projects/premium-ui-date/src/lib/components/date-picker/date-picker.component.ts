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
import type { PuiDateEmittedValue, PuiDatePickerConfig, PuiDateValue } from '../../interfaces/date.types';
import { PuiDateCvaBridge, providePuiDateCva } from '../../core/forms/date-cva-bridge';
import { isFocusMovingToOverlay, monitorOverlayFocusDismiss } from '../../core/overlays/date-overlay.focus';
import { PuiDateOverlayController } from '../../core/overlays/date-overlay.controller';
import type { PuiDateOverlayHandle } from '../../core/overlays/date-overlay.adapter';
import { PuiDateEngineService } from '../../core/services/date-engine.service';
import { resolveEmittedValue } from '../../core/value/date-value.serializer';
import { PuiCalendarComponent } from '../calendar/calendar.component';
import { PuiDateIconComponent } from '../date-icon/date-icon.component';

@Component({
  selector: 'pui-date-picker',
  imports: [PuiCalendarComponent, PuiDateIconComponent],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [providePuiDateCva(PuiDatePickerComponent)],
  host: {
    class: 'pui-date-picker',
    '[class.pui-date-picker--open]': 'isOpen()',
    '[class.pui-date-picker--disabled]': 'isDisabled()',
    '[class.pui-date-picker--sm]': "merged().size === 'sm'",
    '[class.pui-date-picker--md]': "merged().size === 'md'",
    '[class.pui-date-picker--lg]': "merged().size === 'lg'",
  },
})
export class PuiDatePickerComponent implements ControlValueAccessor {
  private readonly engine = inject(PuiDateEngineService);
  private readonly overlay = inject(PuiDateOverlayController);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly cva = new PuiDateCvaBridge<PuiDateValue>();

  private overlayHandle: PuiDateOverlayHandle | null = null;
  private removeFocusDismiss: (() => void) | null = null;

  readonly config = input<PuiDatePickerConfig>();
  readonly value = model<PuiDateValue>(null);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly placeholder = input<string | null>(null);
  readonly ariaLabel = input<string | null>(null);

  readonly puiOpened = output<void>();
  readonly puiClosed = output<void>();
  readonly puiValueChange = output<PuiDateEmittedValue>();
  readonly puiSelectionChange = output<PuiDateEmittedValue>();
  readonly puiFocus = output<void>();
  readonly puiBlur = output<void>();

  protected readonly isOpen = signal(false);
  protected readonly inputText = signal('');

  private readonly triggerRef = viewChild.required<ElementRef<HTMLElement>>('trigger');
  private readonly inputRef = viewChild.required<ElementRef<HTMLInputElement>>('input');
  private readonly panelTemplate = viewChild.required<TemplateRef<unknown>>('panelTemplate');

  protected readonly merged = computed(() =>
    this.engine.mergeConfig({ ...this.config(), mode: 'date', selectionMode: 'single' })
  );

  protected readonly calendarConfig = computed(() => this.merged());

  protected readonly showClearButton = computed(
    () => this.merged().allowClear === true && this.value() != null && !this.isDisabled()
  );

  protected readonly displayValue = computed(() => {
    const formatted = this.engine.format(this.value(), this.merged());
    return formatted || this.inputText();
  });

  protected readonly isDisabled = computed(
    () => this.disabled() || this.cva.formDisabled() || this.merged().readonly === true
  );

  writeValue(value: PuiDateValue): void {
    const coerced = this.engine.coerceValue(value);
    this.value.set(coerced);
    this.inputText.set(this.engine.format(coerced, this.merged()));
  }

  registerOnChange(fn: (value: PuiDateValue) => void): void {
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

    this.overlayHandle = this.overlay.open(
      this.triggerRef().nativeElement,
      this.panelTemplate(),
      this.viewContainerRef,
      {
        mobileSheet: this.merged().mobileSheet,
        panelClass: 'pui-date-picker__overlay',
        minWidth: '18rem',
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
    this.commitValue(null);
  }

  protected onInputClick(): void {
    this.openPanel();
  }

  protected onInputChange(event: Event): void {
    const text = (event.target as HTMLInputElement).value;
    this.inputText.set(text);
    const parsed = this.engine.parse(text, this.merged());
    if (parsed != null) {
      this.commitValue(parsed);
    }
  }

  protected onInputFocus(): void {
    this.puiFocus.emit();
  }

  protected onInputBlur(event: FocusEvent): void {
    if (isFocusMovingToOverlay(event, this.overlayHandle?.panelElement)) {
      return;
    }

    const parsed = this.engine.parse(this.inputText(), this.merged());
    if (parsed != null) {
      this.commitValue(parsed);
    }
    this.cva.markTouched();
    this.puiBlur.emit();
  }

  protected onCalendarSelect(value: PuiDateValue): void {
    this.commitValue(value);
    this.closePanel();
  }

  protected onInputKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closePanel();
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.openPanel();
    }
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
    this.puiBlur.emit();
  }

  private commitValue(next: PuiDateValue): void {
    this.value.set(next);
    this.inputText.set(this.engine.format(next, this.merged()));
    this.cva.emitChange(next);
    const emitted = resolveEmittedValue('date', next, this.merged().outputType ?? 'parts', this.merged().timezone);
    this.puiValueChange.emit(emitted);
    this.puiSelectionChange.emit(emitted);
  }
}

import { DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import type { PuiMonthPickerConfig } from '../../interfaces/date.types';
import { PuiDateCvaBridge, providePuiDateCva } from '../../core/forms/date-cva-bridge';
import { PuiDateEngineService } from '../../core/services/date-engine.service';

@Component({
  selector: 'pui-month-picker',
  templateUrl: './month-picker.component.html',
  styleUrl: './month-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [providePuiDateCva(PuiMonthPickerComponent)],
  host: { class: 'pui-month-picker' },
})
export class PuiMonthPickerComponent implements ControlValueAccessor {
  private readonly engine = inject(PuiDateEngineService);
  private readonly cva = new PuiDateCvaBridge<number | null>();

  readonly config = input<PuiMonthPickerConfig>();
  readonly value = model<number | null>(null);
  readonly disabled = input(false, { transform: booleanAttribute });

  readonly valueChange = output<number | null>();
  readonly monthChange = output<number>();

  protected readonly merged = computed(() => this.engine.mergeConfig(this.config()));
  protected readonly months = computed(() => this.engine.getMonths(this.config()));
  protected readonly year = signal(new Date().getFullYear());

  writeValue(value: number | null): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: number | null) => void): void {
    this.cva.registerOnChange(fn);
  }

  registerOnTouched(fn: () => void): void {
    this.cva.registerOnTouched(fn);
  }

  setDisabledState(isDisabled: boolean): void {
    this.cva.setDisabledState(isDisabled);
  }

  protected selectMonth(index: number): void {
    const month = index + 1;
    this.value.set(month);
    this.cva.commit(month);
    this.valueChange.emit(month);
    this.monthChange.emit(month);
  }
}

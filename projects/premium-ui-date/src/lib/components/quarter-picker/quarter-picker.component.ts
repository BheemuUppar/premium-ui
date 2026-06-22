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
import type { PuiQuarterPickerConfig, PuiQuarterValue } from '../../interfaces/date.types';
import { PuiDateCvaBridge, providePuiDateCva } from '../../core/forms/date-cva-bridge';
import { PuiDateEngineService } from '../../core/services/date-engine.service';

@Component({
  selector: 'pui-quarter-picker',
  templateUrl: './quarter-picker.component.html',
  styleUrl: './quarter-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [providePuiDateCva(PuiQuarterPickerComponent)],
  host: { class: 'pui-quarter-picker' },
})
export class PuiQuarterPickerComponent implements ControlValueAccessor {
  private readonly engine = inject(PuiDateEngineService);
  private readonly cva = new PuiDateCvaBridge<PuiQuarterValue | null>();

  readonly config = input<PuiQuarterPickerConfig>();
  readonly value = model<PuiQuarterValue | null>(null);
  readonly disabled = input(false, { transform: booleanAttribute });

  readonly valueChange = output<PuiQuarterValue | null>();

  protected readonly year = signal(new Date().getFullYear());
  protected readonly quarters = computed(() =>
    ([1, 2, 3, 4] as const).map((quarter) => ({
      quarter,
      label: this.engine.getQuarterLabel(this.year(), quarter),
    }))
  );

  writeValue(value: PuiQuarterValue | null): void {
    this.value.set(value);
    if (value?.year) this.year.set(value.year);
  }

  registerOnChange(fn: (value: PuiQuarterValue | null) => void): void {
    this.cva.registerOnChange(fn);
  }

  registerOnTouched(fn: () => void): void {
    this.cva.registerOnTouched(fn);
  }

  setDisabledState(isDisabled: boolean): void {
    this.cva.setDisabledState(isDisabled);
  }

  protected selectQuarter(quarter: 1 | 2 | 3 | 4): void {
    const next = { year: this.year(), quarter };
    this.value.set(next);
    this.cva.commit(next);
    this.valueChange.emit(next);
  }
}

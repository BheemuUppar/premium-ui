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
import type { PuiYearPickerConfig } from '../../interfaces/date.types';
import { PuiDateCvaBridge, providePuiDateCva } from '../../core/forms/date-cva-bridge';
import { PuiDateEngineService } from '../../core/services/date-engine.service';

@Component({
  selector: 'pui-year-picker',
  templateUrl: './year-picker.component.html',
  styleUrl: './year-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [providePuiDateCva(PuiYearPickerComponent)],
  host: { class: 'pui-year-picker' },
})
export class PuiYearPickerComponent implements ControlValueAccessor {
  private readonly engine = inject(PuiDateEngineService);
  private readonly cva = new PuiDateCvaBridge<number | null>();

  readonly config = input<PuiYearPickerConfig>();
  readonly value = model<number | null>(null);
  readonly disabled = input(false, { transform: booleanAttribute });

  readonly valueChange = output<number | null>();
  readonly yearChange = output<number>();

  protected readonly anchorYear = signal(new Date().getFullYear());
  protected readonly years = computed(() => {
    const start = this.anchorYear() - 6;
    return Array.from({ length: 12 }, (_, index) => start + index);
  });

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

  protected selectYear(year: number): void {
    this.value.set(year);
    this.cva.commit(year);
    this.valueChange.emit(year);
    this.yearChange.emit(year);
  }

  protected shiftPage(delta: number): void {
    this.anchorYear.update((year) => year + delta * 12);
  }
}

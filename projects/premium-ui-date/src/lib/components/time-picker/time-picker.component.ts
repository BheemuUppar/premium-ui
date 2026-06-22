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
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import type { PuiDateEmittedValue, PuiTimePickerConfig } from '../../interfaces/date.types';
import { PuiDateCvaBridge, providePuiDateCva } from '../../core/forms/date-cva-bridge';
import { PuiDateEngineService } from '../../core/services/date-engine.service';
import { PuiDateIconComponent } from '../date-icon/date-icon.component';

export interface PuiTimeParts {
  readonly hour: number;
  readonly minute: number;
  readonly second: number;
  readonly period?: 'AM' | 'PM';
}

@Component({
  selector: 'pui-time-picker',
  imports: [DecimalPipe, PuiDateIconComponent],
  templateUrl: './time-picker.component.html',
  styleUrl: './time-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [providePuiDateCva(PuiTimePickerComponent)],
  host: { class: 'pui-time-picker' },
})
export class PuiTimePickerComponent implements ControlValueAccessor {
  private readonly engine = inject(PuiDateEngineService);
  private readonly cva = new PuiDateCvaBridge<PuiTimeParts>();

  readonly config = input<PuiTimePickerConfig>();
  readonly value = model<PuiTimeParts>({ hour: 9, minute: 0, second: 0, period: 'AM' });
  readonly disabled = input(false, { transform: booleanAttribute });

  readonly puiValueChange = output<PuiDateEmittedValue>();
  readonly puiSelectionChange = output<PuiDateEmittedValue>();

  protected readonly merged = computed(() => this.engine.mergeConfig({ ...this.config(), mode: 'time' }));

  protected readonly is12Hour = computed(() => this.merged().hourCycle === 12);

  protected readonly hours = computed(() => {
    if (this.is12Hour()) {
      return Array.from({ length: 12 }, (_, index) => index + 1);
    }
    return Array.from({ length: 24 }, (_, index) => index);
  });

  protected readonly minutes = computed(() => Array.from({ length: 60 }, (_, index) => index));
  protected readonly seconds = computed(() =>
    this.merged().showSeconds ? Array.from({ length: 60 }, (_, index) => index) : []
  );

  protected readonly displayHour = computed(() => {
    const hour = this.value().hour;
    if (!this.is12Hour()) {
      return hour;
    }
    const normalized = hour % 12;
    return normalized === 0 ? 12 : normalized;
  });

  writeValue(value: PuiTimeParts | null): void {
    if (value) {
      this.value.set(this.normalizeIncoming(value));
    }
  }

  registerOnChange(fn: (value: PuiTimeParts) => void): void {
    this.cva.registerOnChange(fn);
  }

  registerOnTouched(fn: () => void): void {
    this.cva.registerOnTouched(fn);
  }

  setDisabledState(isDisabled: boolean): void {
    this.cva.setDisabledState(isDisabled);
  }

  protected updateHour(hour: number): void {
    const nextHour = this.is12Hour()
      ? this.to24Hour(hour, this.value().period ?? 'AM')
      : hour;
    this.commit({ ...this.value(), hour: nextHour });
  }

  protected updateMinute(minute: number): void {
    this.commit({ ...this.value(), minute });
  }

  protected updateSecond(second: number): void {
    this.commit({ ...this.value(), second });
  }

  protected updatePeriod(period: 'AM' | 'PM'): void {
    const hour = this.to24Hour(this.displayHour(), period);
    this.commit({ ...this.value(), hour, period });
  }

  private commit(next: PuiTimeParts): void {
    this.value.set(next);
    this.cva.emitChange(next);
    const emitted = next as unknown as PuiDateEmittedValue;
    this.puiValueChange.emit(emitted);
    this.puiSelectionChange.emit(emitted);
  }

  private normalizeIncoming(value: PuiTimeParts): PuiTimeParts {
    if (!this.is12Hour()) {
      return value;
    }
    const period: 'AM' | 'PM' = value.hour >= 12 ? 'PM' : 'AM';
    return { ...value, period: value.period ?? period };
  }

  private to24Hour(hour12: number, period: 'AM' | 'PM'): number {
    if (period === 'AM') {
      return hour12 === 12 ? 0 : hour12;
    }
    return hour12 === 12 ? 12 : hour12 + 12;
  }
}

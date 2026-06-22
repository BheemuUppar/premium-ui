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
import type { PuiDatePickerConfig, PuiCalendarDateTimeParts, PuiDateTimePickerConfig, PuiDateValue, PuiTimePickerConfig } from '../../interfaces/date.types';
import { PuiDateCvaBridge, providePuiDateCva } from '../../core/forms/date-cva-bridge';
import { PuiDateEngineService } from '../../core/services/date-engine.service';
import { PuiDatePickerComponent } from '../date-picker/date-picker.component';
import { PuiTimePickerComponent, type PuiTimeParts } from '../time-picker/time-picker.component';

@Component({
  selector: 'pui-datetime-picker',
  imports: [PuiDatePickerComponent, PuiTimePickerComponent],
  templateUrl: './datetime-picker.component.html',
  styleUrl: './datetime-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [providePuiDateCva(PuiDateTimePickerComponent)],
  host: { class: 'pui-datetime-picker' },
})
export class PuiDateTimePickerComponent implements ControlValueAccessor {
  private readonly engine = inject(PuiDateEngineService);
  private readonly cva = new PuiDateCvaBridge<PuiCalendarDateTimeParts | null>();

  readonly config = input<PuiDateTimePickerConfig>();
  readonly value = model<PuiCalendarDateTimeParts | null>(null);
  readonly disabled = input(false, { transform: booleanAttribute });

  readonly valueChange = output<PuiCalendarDateTimeParts | null>();

  protected readonly dateConfig = computed(
    (): PuiDatePickerConfig => ({
      ...this.engine.mergeConfig({ ...this.config(), mode: 'date' }),
      selectionMode: 'single',
      mode: 'date',
    })
  );
  protected readonly timeConfig = computed(
    (): PuiTimePickerConfig => ({
      locale: this.config()?.locale,
      timezone: this.config()?.timezone,
      hourCycle: this.config()?.hourCycle,
      showSeconds: this.config()?.showSeconds,
      appearance: this.config()?.appearance,
      size: this.config()?.size,
      mode: 'time',
    })
  );
  protected readonly datePart = computed(() => {
    const value = this.value();
    return value ? { year: value.year, month: value.month, day: value.day } : null;
  });
  protected readonly timePart = computed((): PuiTimeParts => {
    const value = this.value();
    return value ? { hour: value.hour, minute: value.minute, second: value.second } : { hour: 0, minute: 0, second: 0 };
  });

  writeValue(value: PuiCalendarDateTimeParts | null): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: PuiCalendarDateTimeParts | null) => void): void {
    this.cva.registerOnChange(fn);
  }

  registerOnTouched(fn: () => void): void {
    this.cva.registerOnTouched(fn);
  }

  setDisabledState(isDisabled: boolean): void {
    this.cva.setDisabledState(isDisabled);
  }

  protected onDatePartsChange(date: PuiDateValue): void {
    if (date == null) {
      this.commit(null);
      return;
    }
    const current = this.value() ?? { ...date, hour: 0, minute: 0, second: 0 };
    this.commit({ ...current, ...date });
  }

  protected onTimeChange(time: PuiTimeParts): void {
    const current = this.value() ?? { year: 2000, month: 1, day: 1, ...time };
    this.commit({ ...current, ...time });
  }

  private commit(next: PuiCalendarDateTimeParts | null): void {
    this.value.set(next);
    this.cva.emitChange(next);
    this.valueChange.emit(next);
  }
}

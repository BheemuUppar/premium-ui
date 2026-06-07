import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  contentChildren,
  forwardRef,
  input,
  model,
  output,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { PuiCvaBridge, providePuiCva } from '../../internal/forms';
import { isActivationKey, PUI_KEYS } from '../../internal/keyboard';
import { PUI_RADIO_GROUP } from '../../internal/selection/radio-group.token';
import { findNextEnabledIndex } from '../../internal/selection/selection.utils';
import { PuiRadioComponent } from './radio.component';
import type { PuiRadioOrientation, PuiRadioValue } from './radio.types';
import { radioValuesEqual } from './radio.utils';

@Component({
  selector: 'pui-radio-group',
  templateUrl: './radio-group.component.html',
  styleUrl: './radio-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: PUI_RADIO_GROUP,
      useExisting: forwardRef(() => PuiRadioGroupComponent),
    },
    providePuiCva(PuiRadioGroupComponent),
  ],
  host: {
    class: 'pui-radio-group',
    '[class.pui-radio-group--vertical]': "orientation() === 'vertical'",
    '[class.pui-radio-group--horizontal]': "orientation() === 'horizontal'",
    '[class.pui-radio-group--disabled]': 'isDisabled()',
    '[class.pui-radio-group--invalid]': 'invalid()',
    '(keydown)': 'handleGroupKeydown($event)',
  },
})
export class PuiRadioGroupComponent implements ControlValueAccessor {
  private readonly cva = new PuiCvaBridge<PuiRadioValue | null>();
  private readonly radios = contentChildren(PuiRadioComponent);

  readonly value = model<PuiRadioValue | null>(null);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly orientation = input<PuiRadioOrientation>('vertical');
  readonly name = input<string | null>(null);
  readonly ariaLabel = input<string | null>(null);

  readonly selectionChange = output<PuiRadioValue | null>();

  isDisabled(): boolean {
    return this.disabled() || this.cva.formDisabled();
  }

  isRequired(): boolean {
    return this.required();
  }

  isInvalid(): boolean {
    return this.invalid();
  }

  isSelected(itemValue: PuiRadioValue): boolean {
    const current = this.value();
    return current !== null && radioValuesEqual(current, itemValue);
  }

  selectValue(itemValue: PuiRadioValue): void {
    if (this.isDisabled()) {
      return;
    }

    this.value.set(itemValue);
    this.cva.commit(itemValue);
    this.selectionChange.emit(itemValue);
  }

  markTouched(): void {
    this.cva.markTouched();
  }

  handleRadioKeydown(event: KeyboardEvent, source: PuiRadioComponent): void {
    this.handleGroupKeydown(event, source);
  }

  handleGroupKeydown(event: KeyboardEvent, source?: PuiRadioComponent): void {
    const items = this.radios().map((radio, index) => ({
      index,
      radio,
      disabled: radio.isDisabledState(),
    }));

    if (items.length === 0) {
      return;
    }

    const currentIndex = source
      ? items.findIndex((entry) => entry.radio === source)
      : items.findIndex((entry) => entry.radio.isCheckedState());

    const activeIndex = currentIndex >= 0 ? currentIndex : 0;

    switch (event.key) {
      case PUI_KEYS.ARROW_DOWN:
      case PUI_KEYS.ARROW_RIGHT:
        event.preventDefault();
        this.focusRadioAt(this.nextEnabledIndex(items, activeIndex, 1));
        break;
      case PUI_KEYS.ARROW_UP:
      case PUI_KEYS.ARROW_LEFT:
        event.preventDefault();
        this.focusRadioAt(this.nextEnabledIndex(items, activeIndex, -1));
        break;
      case PUI_KEYS.HOME:
        event.preventDefault();
        this.focusRadioAt(this.nextEnabledIndex(items, -1, 1));
        break;
      case PUI_KEYS.END:
        event.preventDefault();
        this.focusRadioAt(this.nextEnabledIndex(items, items.length, -1));
        break;
      default:
        if (isActivationKey(event.key) && source) {
          const itemValue = source.getItemValue();
          if (itemValue !== undefined && !source.isDisabledState()) {
            this.selectValue(itemValue);
          }
        }
        break;
    }
  }

  writeValue(value: PuiRadioValue | null): void {
    this.value.set(value ?? null);
  }

  registerOnChange(fn: (value: PuiRadioValue | null) => void): void {
    this.cva.registerOnChange(fn);
  }

  registerOnTouched(fn: () => void): void {
    this.cva.registerOnTouched(fn);
  }

  setDisabledState(isDisabled: boolean): void {
    this.cva.setDisabledState(isDisabled);
  }

  private nextEnabledIndex(
    items: { index: number; radio: PuiRadioComponent; disabled: boolean }[],
    startIndex: number,
    direction: 1 | -1
  ): number {
    return findNextEnabledIndex(items, startIndex, direction);
  }

  private focusRadioAt(index: number): void {
    const radio = this.radios()[index];
    if (!radio || radio.isDisabledState()) {
      return;
    }

    const itemValue = radio.getItemValue();
    if (itemValue !== undefined) {
      this.selectValue(itemValue);
    }

    radio.focusNative();
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  forwardRef,
  input,
  model,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { PuiCheckboxOrientation, PuiCheckboxValue } from './checkbox.types';
import { PUI_CHECKBOX_GROUP } from './checkbox-group.token';

@Component({
  selector: 'pui-checkbox-group',
  template: `<div class="pui-checkbox-group__inner" role="group" [attr.aria-label]="ariaLabel()"><ng-content /></div>`,
  styleUrl: './checkbox-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: PUI_CHECKBOX_GROUP,
      useExisting: forwardRef(() => PuiCheckboxGroupComponent),
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PuiCheckboxGroupComponent),
      multi: true,
    },
  ],
  host: {
    class: 'pui-checkbox-group',
    '[class.pui-checkbox-group--vertical]': "orientation() === 'vertical'",
    '[class.pui-checkbox-group--horizontal]': "orientation() === 'horizontal'",
    '[class.pui-checkbox-group--disabled]': 'isDisabled()',
  },
})
export class PuiCheckboxGroupComponent implements ControlValueAccessor {
  readonly value = model<PuiCheckboxValue[]>([]);
  readonly name = input<string | null>(null);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly orientation = input<PuiCheckboxOrientation>('vertical');
  readonly ariaLabel = input<string | null>(null);

  private readonly formDisabled = signal(false);

  private onChange: (value: PuiCheckboxValue[]) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  isDisabled(): boolean {
    return this.disabled() || this.formDisabled();
  }

  containsValue(itemValue: PuiCheckboxValue): boolean {
    return this.value().some((entry) => Object.is(entry, itemValue));
  }

  toggleValue(itemValue: PuiCheckboxValue, checked: boolean): void {
    if (this.isDisabled()) {
      return;
    }

    const current = [...this.value()];

    if (checked) {
      if (!this.containsValue(itemValue)) {
        current.push(itemValue);
      }
    } else {
      const index = current.findIndex((entry) => Object.is(entry, itemValue));
      if (index >= 0) {
        current.splice(index, 1);
      }
    }

    this.value.set(current);
    this.onChange(current);
    this.onTouched();
  }

  writeValue(value: PuiCheckboxValue[] | null): void {
    this.value.set(Array.isArray(value) ? [...value] : []);
  }

  registerOnChange(fn: (value: PuiCheckboxValue[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
  }
}

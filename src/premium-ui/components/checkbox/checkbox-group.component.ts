import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  forwardRef,
  input,
  model,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { PuiCvaBridge, providePuiCva } from '../../internal/forms';
import { PUI_CHECKBOX_GROUP } from '../../internal/selection';
import type { PuiCheckboxOrientation, PuiCheckboxValue } from './checkbox.types';

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
    providePuiCva(PuiCheckboxGroupComponent),
  ],
  host: {
    class: 'pui-checkbox-group',
    '[class.pui-checkbox-group--vertical]': "orientation() === 'vertical'",
    '[class.pui-checkbox-group--horizontal]': "orientation() === 'horizontal'",
    '[class.pui-checkbox-group--disabled]': 'isDisabled()',
  },
})
export class PuiCheckboxGroupComponent implements ControlValueAccessor {
  private readonly cva = new PuiCvaBridge<PuiCheckboxValue[]>();

  readonly value = model<PuiCheckboxValue[]>([]);
  readonly name = input<string | null>(null);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly orientation = input<PuiCheckboxOrientation>('vertical');
  readonly ariaLabel = input<string | null>(null);

  isDisabled(): boolean {
    return this.disabled() || this.cva.formDisabled();
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
    this.cva.commit(current);
  }

  writeValue(value: PuiCheckboxValue[] | null): void {
    this.value.set(Array.isArray(value) ? [...value] : []);
  }

  registerOnChange(fn: (value: PuiCheckboxValue[]) => void): void {
    this.cva.registerOnChange(fn);
  }

  registerOnTouched(fn: () => void): void {
    this.cva.registerOnTouched(fn);
  }

  setDisabledState(isDisabled: boolean): void {
    this.cva.setDisabledState(isDisabled);
  }
}

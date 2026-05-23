import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
  model,
  output,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { joinDescribedBy, toAriaBoolean } from '../../internal/accessibility';
import { PuiCvaBridge, providePuiCva } from '../../internal/forms';
import { isActivationKey } from '../../internal/keyboard';
import { createPuiId } from '../../internal/utilities';
import type { PuiSwitchSize, PuiSwitchVariant } from './switch.types';
import { normalizeSwitchValue } from './switch.utils';

@Component({
  selector: 'pui-switch',
  templateUrl: './switch.component.html',
  styleUrl: './switch.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [providePuiCva(PuiSwitchComponent)],
  host: {
    class: 'pui-switch',
    '[class.pui-switch--default]': "variant() === 'default'",
    '[class.pui-switch--filled]': "variant() === 'filled'",
    '[class.pui-switch--outlined]': "variant() === 'outlined'",
    '[class.pui-switch--soft]': "variant() === 'soft'",
    '[class.pui-switch--minimal]': "variant() === 'minimal'",
    '[class.pui-switch--ios]': "variant() === 'ios'",
    '[class.pui-switch--success]': "variant() === 'success'",
    '[class.pui-switch--danger]': "variant() === 'danger'",
    '[class.pui-switch--sm]': "size() === 'sm'",
    '[class.pui-switch--md]': "size() === 'md'",
    '[class.pui-switch--lg]': "size() === 'lg'",
    '[class.pui-switch--checked]': 'checked()',
    '[class.pui-switch--disabled]': 'isDisabled()',
    '[class.pui-switch--invalid]': 'invalid()',
    '[class.pui-switch--loading]': 'loading()',
  },
})
export class PuiSwitchComponent implements ControlValueAccessor {
  private readonly cva = new PuiCvaBridge<boolean>();

  readonly variant = input<PuiSwitchVariant>('default');
  readonly size = input<PuiSwitchSize>('md');
  readonly checked = model(false);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly label = input<string | null>(null);
  readonly description = input<string | null>(null);
  readonly helperText = input<string | null>(null);
  readonly error = input<string | null>(null);
  readonly ariaLabel = input<string | null>(null);

  readonly checkedChange = output<boolean>();
  readonly valueChange = output<boolean>();

  private readonly switchId = createPuiId('pui-switch');
  private readonly helperId = `${this.switchId}-helper`;
  private readonly errorId = `${this.switchId}-error`;
  private readonly descriptionId = `${this.switchId}-description`;
  private readonly labelElementId = `${this.switchId}-label`;

  protected readonly isDisabled = computed(
    () => this.disabled() || this.loading() || this.cva.formDisabled()
  );

  protected readonly isInvalid = computed(() => this.invalid() || !!this.error());

  protected readonly describedBy = computed(() =>
    joinDescribedBy([
      this.description() ? this.descriptionId : null,
      this.helperText() ? this.helperId : null,
      this.error() ? this.errorId : null,
    ])
  );

  protected readonly controlId = this.switchId;
  protected readonly labelId = this.labelElementId;
  protected readonly descriptionTextId = this.descriptionId;
  protected readonly helperTextId = this.helperId;
  protected readonly errorTextId = this.errorId;

  writeValue(value: boolean): void {
    this.checked.set(normalizeSwitchValue(value));
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.cva.registerOnChange(fn);
  }

  registerOnTouched(fn: () => void): void {
    this.cva.registerOnTouched(fn);
  }

  setDisabledState(isDisabled: boolean): void {
    this.cva.setDisabledState(isDisabled);
  }

  protected toggle(): void {
    if (this.isDisabled()) {
      return;
    }

    const next = !this.checked();
    this.commit(next);
  }

  protected handleKeydown(event: KeyboardEvent): void {
    if (!isActivationKey(event.key)) {
      return;
    }

    event.preventDefault();
    this.toggle();
  }

  protected handleBlur(): void {
    this.cva.markTouched();
  }

  private commit(next: boolean): void {
    this.checked.set(next);
    this.checkedChange.emit(next);
    this.valueChange.emit(next);
    this.cva.commit(next);
  }

  protected ariaChecked(): 'true' | 'false' {
    return toAriaBoolean(this.checked());
  }
}

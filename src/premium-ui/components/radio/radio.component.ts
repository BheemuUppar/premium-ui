import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  inject,
  input,
  model,
  output,
  viewChild,
  ElementRef,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { joinDescribedBy } from '../../internal/accessibility';
import { PuiCvaBridge, providePuiCva } from '../../internal/forms';
import { PUI_RADIO_GROUP } from '../../internal/selection/radio-group.token';
import { createPuiId } from '../../internal/utilities';
import type { PuiRadioSize, PuiRadioValue, PuiRadioVariant } from './radio.types';

@Component({
  selector: 'pui-radio',
  templateUrl: './radio.component.html',
  styleUrl: './radio.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [providePuiCva(PuiRadioComponent)],
  host: {
    class: 'pui-radio',
    '[class.pui-radio--default]': "variant() === 'default'",
    '[class.pui-radio--filled]': "variant() === 'filled'",
    '[class.pui-radio--outlined]': "variant() === 'outlined'",
    '[class.pui-radio--soft]': "variant() === 'soft'",
    '[class.pui-radio--minimal]': "variant() === 'minimal'",
    '[class.pui-radio--card]': "variant() === 'card'",
    '[class.pui-radio--sm]': "size() === 'sm'",
    '[class.pui-radio--md]': "size() === 'md'",
    '[class.pui-radio--lg]': "size() === 'lg'",
    '[class.pui-radio--checked]': 'isChecked()',
    '[class.pui-radio--disabled]': 'isDisabled()',
    '[class.pui-radio--invalid]': 'isInvalid()',
    '[attr.tabindex]': 'rovingTabIndex()',
    '(keydown)': 'handleKeydown($event)',
  },
})
export class PuiRadioComponent implements ControlValueAccessor {
  private readonly group = inject(PUI_RADIO_GROUP, { optional: true });
  private readonly cva = new PuiCvaBridge<boolean>();

  readonly variant = input<PuiRadioVariant>('default');
  readonly size = input<PuiRadioSize>('md');
  readonly value = input<PuiRadioValue | undefined>(undefined);
  readonly checked = model(false);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly name = input<string | null>(null);
  readonly label = input<string | null>(null);
  readonly description = input<string | null>(null);
  readonly helperText = input<string | null>(null);
  readonly ariaLabel = input<string | null>(null);

  readonly checkedChange = output<boolean>();
  readonly valueChange = output<PuiRadioValue>();

  private readonly radioId = createPuiId('pui-radio');
  private readonly helperId = `${this.radioId}-helper`;
  private readonly errorId = `${this.radioId}-error`;

  private readonly nativeInput = viewChild<ElementRef<HTMLInputElement>>('nativeInput');

  protected readonly inGroup = computed(() => this.group !== null && this.value() !== undefined);

  private readonly checkedState = computed(() => {
    if (this.inGroup()) {
      return this.group!.isSelected(this.value()!);
    }
    return this.checked();
  });

  private readonly disabledState = computed(
    () => this.disabled() || this.cva.formDisabled() || this.group?.isDisabled() === true
  );

  protected readonly isChecked = this.checkedState;
  protected readonly isDisabled = this.disabledState;

  isCheckedState(): boolean {
    return this.checkedState();
  }

  isDisabledState(): boolean {
    return this.disabledState();
  }

  getItemValue(): PuiRadioValue | undefined {
    return this.value();
  }

  protected readonly isInvalid = computed(
    () => this.invalid() || this.group?.isInvalid() === true
  );

  protected readonly isRequired = computed(
    () => this.required() || this.group?.isRequired() === true
  );

  protected readonly radioName = computed(() => this.name() ?? this.group?.name() ?? null);

  protected readonly describedBy = computed(() =>
    joinDescribedBy([
      this.helperText() ? this.helperId : null,
      this.description() ? `${this.radioId}-desc` : null,
    ])
  );

  protected readonly rovingTabIndex = computed(() => (this.isChecked() ? 0 : -1));

  protected readonly inputId = this.radioId;
  protected readonly helperTextId = this.helperId;

  writeValue(value: boolean): void {
    if (!this.inGroup()) {
      this.checked.set(!!value);
    }
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

  focusNative(): void {
    this.nativeInput()?.nativeElement.focus();
  }

  protected handleChange(event: Event): void {
    if (this.isDisabled()) {
      event.preventDefault();
      return;
    }

    const itemValue = this.value();

    if (this.inGroup() && itemValue !== undefined) {
      this.group!.selectValue(itemValue);
      return;
    }

    this.checked.set(true);
    this.checkedChange.emit(true);
    this.cva.commit(true);

    if (itemValue !== undefined) {
      this.valueChange.emit(itemValue);
    }
  }

  protected handleBlur(): void {
    if (!this.inGroup()) {
      this.cva.markTouched();
    } else {
      this.group!.markTouched();
    }
  }

  protected handleKeydown(event: KeyboardEvent): void {
    if (this.inGroup()) {
      this.group!.handleRadioKeydown(event, this);
    }
  }
}

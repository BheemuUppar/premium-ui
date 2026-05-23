import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  model,
  signal,
  viewChild,
  ElementRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { PuiCheckboxSize, PuiCheckboxVariant, PuiCheckboxValue } from './checkbox.types';
import { PUI_CHECKBOX_GROUP } from './checkbox-group.token';

let nextCheckboxId = 0;

@Component({
  selector: 'pui-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PuiCheckboxComponent),
      multi: true,
    },
  ],
  host: {
    class: 'pui-checkbox',
    '[class.pui-checkbox--default]': "variant() === 'default'",
    '[class.pui-checkbox--filled]': "variant() === 'filled'",
    '[class.pui-checkbox--soft]': "variant() === 'soft'",
    '[class.pui-checkbox--minimal]': "variant() === 'minimal'",
    '[class.pui-checkbox--card]': "variant() === 'card'",
    '[class.pui-checkbox--sm]': "size() === 'sm'",
    '[class.pui-checkbox--md]': "size() === 'md'",
    '[class.pui-checkbox--lg]': "size() === 'lg'",
    '[class.pui-checkbox--checked]': 'isChecked()',
    '[class.pui-checkbox--indeterminate]': 'showIndeterminate()',
    '[class.pui-checkbox--disabled]': 'isDisabled()',
    '[class.pui-checkbox--readonly]': 'readOnly()',
    '[class.pui-checkbox--invalid]': 'isInvalid()',
    '[class.pui-checkbox--loading]': 'loading()',
    '[class.pui-checkbox--embedded]': 'embedded()',
  },
})
export class PuiCheckboxComponent implements ControlValueAccessor {
  private readonly group = inject(PUI_CHECKBOX_GROUP, { optional: true });

  readonly variant = input<PuiCheckboxVariant>('default');
  readonly size = input<PuiCheckboxSize>('md');
  readonly checked = model(false);
  readonly indeterminate = input(false, { transform: booleanAttribute });
  readonly value = input<PuiCheckboxValue>(undefined);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readOnly = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });
  readonly embedded = input(false, { transform: booleanAttribute });
  readonly name = input<string | null>(null);
  readonly ariaLabel = input<string | null>(null);
  readonly helper = input<string | null>(null);
  readonly error = input<string | null>(null);

  private readonly checkboxId = `pui-checkbox-${++nextCheckboxId}`;
  private readonly helperId = `${this.checkboxId}-helper`;
  private readonly errorId = `${this.checkboxId}-error`;

  protected readonly formDisabled = signal(false);

  private readonly nativeInput = viewChild<ElementRef<HTMLInputElement>>('nativeInput');

  protected readonly inGroup = computed(() => this.group !== null && this.value() !== undefined);

  protected readonly isChecked = computed(() => {
    if (this.inGroup()) {
      return this.group!.containsValue(this.value());
    }
    return this.checked();
  });

  protected readonly showIndeterminate = computed(
    () => this.indeterminate() && !this.isChecked() && !this.inGroup()
  );

  protected readonly isDisabled = computed(
    () => this.disabled() || this.formDisabled() || this.group?.isDisabled() === true
  );

  protected readonly isInvalid = computed(() => this.invalid() || !!this.error());

  protected readonly checkboxName = computed(() => this.name() ?? this.group?.name() ?? null);

  protected readonly describedBy = computed(() => {
    const ids: string[] = [];
    if (this.helper()) {
      ids.push(this.helperId);
    }
    if (this.error()) {
      ids.push(this.errorId);
    }
    return ids.length ? ids.join(' ') : null;
  });

  protected readonly inputId = this.checkboxId;
  protected readonly helperTextId = this.helperId;
  protected readonly errorTextId = this.errorId;

  private onChange: (value: boolean) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  constructor() {
    effect(() => {
      const inputEl = this.nativeInput()?.nativeElement;
      if (!inputEl) {
        return;
      }
      inputEl.indeterminate = this.showIndeterminate();
    });
  }

  writeValue(value: boolean): void {
    if (!this.inGroup()) {
      this.checked.set(!!value);
    }
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
  }

  protected handleChange(event: Event): void {
    if (this.isDisabled() || this.readOnly() || this.loading()) {
      event.preventDefault();
      return;
    }

    const nextChecked = (event.target as HTMLInputElement).checked;

    if (this.inGroup()) {
      this.group!.toggleValue(this.value(), nextChecked);
      return;
    }

    this.checked.set(nextChecked);
    this.onChange(nextChecked);
    this.onTouched();
  }

  protected handleBlur(): void {
    if (!this.inGroup()) {
      this.onTouched();
    }
  }
}

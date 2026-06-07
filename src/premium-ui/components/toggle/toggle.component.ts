import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  ElementRef,
  inject,
  input,
  model,
  output,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { PuiCvaBridge, providePuiCva } from '../../internal/forms';
import { isActivationKey } from '../../internal/keyboard';
import { PUI_TOGGLE_GROUP } from '../../internal/selection/toggle-group.token';
import { createPuiId } from '../../internal/utilities';
import type {
  PuiToggleDensity,
  PuiToggleShape,
  PuiToggleSize,
  PuiToggleValue,
  PuiToggleVariant,
} from './toggle.types';
import { normalizeTogglePressed, toAriaPressed } from './toggle.utils';

@Component({
  selector: 'pui-toggle',
  templateUrl: './toggle.component.html',
  styleUrl: './toggle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [providePuiCva(PuiToggleComponent)],
  host: {
    class: 'pui-toggle',
    '[class.pui-toggle--default]': "effectiveVariant() === 'default'",
    '[class.pui-toggle--subtle]': "effectiveVariant() === 'subtle'",
    '[class.pui-toggle--soft]': "effectiveVariant() === 'soft'",
    '[class.pui-toggle--outline]': "effectiveVariant() === 'outline'",
    '[class.pui-toggle--ghost]': "effectiveVariant() === 'ghost'",
    '[class.pui-toggle--elevated]': "effectiveVariant() === 'elevated'",
    '[class.pui-toggle--glass]': "effectiveVariant() === 'glass'",
    '[class.pui-toggle--shape-square]': "effectiveShape() === 'square'",
    '[class.pui-toggle--shape-rounded]': "effectiveShape() === 'rounded'",
    '[class.pui-toggle--shape-pill]': "effectiveShape() === 'pill'",
    '[class.pui-toggle--density-compact]': "effectiveDensity() === 'compact'",
    '[class.pui-toggle--density-default]': "effectiveDensity() === 'default'",
    '[class.pui-toggle--density-comfortable]': "effectiveDensity() === 'comfortable'",
    '[class.pui-toggle--in-segmented]': "groupLayoutMode() === 'segmented'",
    '[class.pui-toggle--in-toolbar]': "groupLayoutMode() === 'toolbar'",
    '[class.pui-toggle--sm]': "effectiveSize() === 'sm'",
    '[class.pui-toggle--md]': "effectiveSize() === 'md'",
    '[class.pui-toggle--lg]': "effectiveSize() === 'lg'",
    '[class.pui-toggle--pressed]': 'isPressed()',
    '[class.pui-toggle--disabled]': 'isDisabled()',
    '[class.pui-toggle--loading]': 'loading()',
    '[class.pui-toggle--icon-only]': 'iconOnly()',
    '(keydown)': 'handleKeydown($event)',
  },
})
export class PuiToggleComponent implements ControlValueAccessor {
  private readonly group = inject(PUI_TOGGLE_GROUP, { optional: true });
  private readonly cva = new PuiCvaBridge<boolean>();

  readonly variant = input<PuiToggleVariant>('default');
  readonly shape = input<PuiToggleShape>('rounded');
  readonly density = input<PuiToggleDensity>('default');
  readonly size = input<PuiToggleSize>('md');
  readonly pressed = model(false);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });
  readonly iconOnly = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input<string | null>(null);
  readonly value = input<PuiToggleValue | undefined>(undefined);

  readonly change = output<PuiToggleValue | boolean>();

  private readonly toggleId = createPuiId('pui-toggle');
  private readonly controlRef = viewChild<ElementRef<HTMLButtonElement>>('control');

  protected readonly inGroup = computed(
    () => this.group !== null && this.value() !== undefined
  );

  protected readonly effectiveVariant = computed(
    () => this.group?.variant() ?? this.variant()
  );

  protected readonly effectiveShape = computed(() => this.group?.shape() ?? this.shape());

  protected readonly effectiveDensity = computed(
    () => this.group?.density() ?? this.density()
  );

  protected readonly effectiveSize = computed(() => this.group?.size() ?? this.size());

  protected readonly groupLayoutMode = computed(() => this.group?.layoutMode() ?? 'default');

  private readonly pressedState = computed(() => {
    if (this.inGroup()) {
      return this.group!.isSelected(this.value()!);
    }
    return this.pressed();
  });

  private readonly disabledState = computed(
    () =>
      this.disabled() ||
      this.loading() ||
      this.cva.formDisabled() ||
      this.group?.isDisabled() === true
  );

  protected readonly isPressed = this.pressedState;
  protected readonly isDisabled = this.disabledState;

  protected readonly rovingTabIndex = computed<number | null>(() => {
    if (!this.inGroup()) {
      return null;
    }
    return this.group!.isRovingActive(this) ? 0 : -1;
  });

  protected readonly controlId = this.toggleId;

  isPressedState(): boolean {
    return this.pressedState();
  }

  isDisabledState(): boolean {
    return this.disabledState();
  }

  getItemValue(): PuiToggleValue | undefined {
    return this.value();
  }

  writeValue(value: boolean): void {
    if (!this.inGroup()) {
      this.pressed.set(normalizeTogglePressed(value));
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
    this.controlRef()?.nativeElement.focus();
  }

  protected ariaPressed(): 'true' | 'false' {
    return toAriaPressed(this.isPressed());
  }

  protected handleClick(): void {
    if (this.isDisabled()) {
      return;
    }

    const itemValue = this.value();

    if (this.inGroup() && itemValue !== undefined) {
      this.group!.toggleItem(itemValue, this);
      return;
    }

    const next = !this.pressed();
    this.commitStandalone(next, itemValue);
  }

  protected handleKeydown(event: KeyboardEvent): void {
    if (this.inGroup()) {
      this.group!.handleToggleKeydown(event, this);
      return;
    }

    if (isActivationKey(event.key)) {
      event.preventDefault();
      this.handleClick();
    }
  }

  protected handleBlur(): void {
    if (!this.inGroup()) {
      this.cva.markTouched();
    } else {
      this.group!.markTouched();
    }
  }

  private commitStandalone(next: boolean, itemValue: PuiToggleValue | undefined): void {
    this.pressed.set(next);
    this.change.emit(itemValue !== undefined ? itemValue : next);
    this.cva.commit(next);
  }
}

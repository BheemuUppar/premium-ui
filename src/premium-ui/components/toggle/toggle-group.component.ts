import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  contentChildren,
  effect,
  forwardRef,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { PuiCvaBridge, providePuiCva } from '../../internal/forms';
import { isActivationKey, PUI_KEYS } from '../../internal/keyboard';
import { PUI_TOGGLE_GROUP } from '../../internal/selection/toggle-group.token';
import {
  containsSelectionValue,
  findNextEnabledIndex,
  toggleSelectionValueSet,
  valuesEqual,
} from '../../internal/selection/selection.utils';
import type { PuiSelectionValue } from '../../types/common.types';
import { PuiToggleComponent } from './toggle.component';
import type { PuiToggleGroupSelection } from './toggle-group.types';
import type {
  PuiToggleDensity,
  PuiToggleGroupMode,
  PuiToggleOrientation,
  PuiToggleShape,
  PuiToggleSize,
  PuiToggleVariant,
} from './toggle.types';

@Component({
  selector: 'pui-toggle-group',
  templateUrl: './toggle-group.component.html',
  styleUrl: './toggle-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: PUI_TOGGLE_GROUP,
      useExisting: forwardRef(() => PuiToggleGroupComponent),
    },
    providePuiCva(PuiToggleGroupComponent),
  ],
  host: {
    class: 'pui-toggle-group',
    '[class.pui-toggle-group--horizontal]': "orientation() === 'horizontal'",
    '[class.pui-toggle-group--vertical]': "orientation() === 'vertical'",
    '[class.pui-toggle-group--disabled]': 'isDisabled()',
    '[class.pui-toggle-group--multiple]': 'multiple()',
    '[class.pui-toggle-group--segmented]': "mode() === 'segmented'",
    '[class.pui-toggle-group--toolbar]': "mode() === 'toolbar'",
    '[class.pui-toggle-group--default]': "variant() === 'default'",
    '[class.pui-toggle-group--subtle]': "variant() === 'subtle'",
    '[class.pui-toggle-group--soft]': "variant() === 'soft'",
    '[class.pui-toggle-group--outline]': "variant() === 'outline'",
    '[class.pui-toggle-group--ghost]': "variant() === 'ghost'",
    '[class.pui-toggle-group--elevated]': "variant() === 'elevated'",
    '[class.pui-toggle-group--glass]': "variant() === 'glass'",
    '[class.pui-toggle-group--shape-square]': "shape() === 'square'",
    '[class.pui-toggle-group--shape-rounded]': "shape() === 'rounded'",
    '[class.pui-toggle-group--shape-pill]': "shape() === 'pill'",
    '[class.pui-toggle-group--density-compact]': "effectiveDensity() === 'compact'",
    '[class.pui-toggle-group--density-comfortable]': "effectiveDensity() === 'comfortable'",
    '[style.--pui-toggle-indicator-index]': 'indicatorIndex()',
    '[style.--pui-toggle-indicator-count]': 'indicatorCount()',
    '(keydown)': 'handleGroupKeydown($event)',
  },
})
export class PuiToggleGroupComponent implements ControlValueAccessor {
  private readonly cva = new PuiCvaBridge<PuiToggleGroupSelection>();
  private readonly toggles = contentChildren(PuiToggleComponent);
  private readonly rovingIndex = signal(0);

  readonly value = model<PuiToggleGroupSelection>(null);
  readonly mode = input<PuiToggleGroupMode>('default');
  readonly variant = input<PuiToggleVariant>('default');
  readonly shape = input<PuiToggleShape>('rounded');
  readonly density = input<PuiToggleDensity>('default');
  readonly multiple = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly orientation = input<PuiToggleOrientation>('horizontal');
  readonly size = input<PuiToggleSize>('md');
  readonly ariaLabel = input<string | null>(null);

  readonly selectionChange = output<PuiToggleGroupSelection>();

  layoutMode(): PuiToggleGroupMode {
    return this.mode();
  }

  protected readonly effectiveDensity = computed((): PuiToggleDensity => {
    if (this.density() !== 'default') {
      return this.density();
    }
    return this.mode() === 'toolbar' ? 'compact' : 'default';
  });

  protected readonly groupRole = computed(() =>
    this.mode() === 'toolbar' ? 'toolbar' : 'group'
  );

  protected readonly indicatorIndex = computed(() => {
    if (this.mode() !== 'segmented' || this.multiple()) {
      return 0;
    }

    const items = this.toggles();
    const current = this.singleValue();
    const index = items.findIndex(
      (toggle) =>
        toggle.getItemValue() !== undefined &&
        current !== null &&
        valuesEqual(toggle.getItemValue()!, current)
    );
    return index >= 0 ? index : 0;
  });

  protected readonly indicatorCount = computed(() => Math.max(this.toggles().length, 1));

  constructor() {
    effect(() => {
      const items = this.toggles();
      const activeIndex = items.findIndex((toggle) => toggle.isPressedState());
      if (activeIndex >= 0) {
        this.rovingIndex.set(activeIndex);
      }
    });
  }

  isDisabled(): boolean {
    return this.disabled() || this.cva.formDisabled();
  }

  isSelected(itemValue: PuiSelectionValue): boolean {
    if (this.multiple()) {
      return containsSelectionValue(this.multiValues(), itemValue);
    }

    const current = this.singleValue();
    return current !== null && valuesEqual(current, itemValue);
  }

  isRovingActive(toggle: PuiToggleComponent): boolean {
    const items = this.toggles();
    const index = items.findIndex((entry) => entry === toggle);
    if (index < 0) {
      return false;
    }

    const activeIndex = this.resolveRovingIndex(items);
    return index === activeIndex;
  }

  toggleItem(itemValue: PuiSelectionValue, source: PuiToggleComponent): void {
    if (this.isDisabled()) {
      return;
    }

    if (this.multiple()) {
      const next = toggleSelectionValueSet(this.multiValues(), itemValue);
      this.commit(next);
      this.syncRovingIndex(source);
      return;
    }

    this.commit(itemValue);
    this.syncRovingIndex(source);
  }

  markTouched(): void {
    this.cva.markTouched();
  }

  handleToggleKeydown(event: KeyboardEvent, source: PuiToggleComponent): void {
    this.handleGroupKeydown(event, source);
  }

  handleGroupKeydown(event: KeyboardEvent, source?: PuiToggleComponent): void {
    const items = this.toggles().map((toggle, index) => ({
      index,
      toggle,
      disabled: toggle.isDisabledState(),
    }));

    if (items.length === 0) {
      return;
    }

    const currentIndex = source
      ? items.findIndex((entry) => entry.toggle === source)
      : this.resolveRovingIndex(items.map((entry) => entry.toggle));

    const activeIndex = currentIndex >= 0 ? currentIndex : 0;
    const isHorizontal = this.orientation() === 'horizontal';
    const selectOnNavigate = !this.multiple() && this.mode() === 'segmented';

    switch (event.key) {
      case PUI_KEYS.ARROW_DOWN:
        if (isHorizontal) {
          return;
        }
        event.preventDefault();
        this.focusToggleAt(this.nextEnabledIndex(items, activeIndex, 1), selectOnNavigate);
        break;
      case PUI_KEYS.ARROW_UP:
        if (isHorizontal) {
          return;
        }
        event.preventDefault();
        this.focusToggleAt(this.nextEnabledIndex(items, activeIndex, -1), selectOnNavigate);
        break;
      case PUI_KEYS.ARROW_RIGHT:
        if (!isHorizontal) {
          return;
        }
        event.preventDefault();
        this.focusToggleAt(this.nextEnabledIndex(items, activeIndex, 1), selectOnNavigate);
        break;
      case PUI_KEYS.ARROW_LEFT:
        if (!isHorizontal) {
          return;
        }
        event.preventDefault();
        this.focusToggleAt(this.nextEnabledIndex(items, activeIndex, -1), selectOnNavigate);
        break;
      case PUI_KEYS.HOME:
        event.preventDefault();
        this.focusToggleAt(this.nextEnabledIndex(items, -1, 1), selectOnNavigate);
        break;
      case PUI_KEYS.END:
        event.preventDefault();
        this.focusToggleAt(this.nextEnabledIndex(items, items.length, -1), selectOnNavigate);
        break;
      default:
        if (isActivationKey(event.key) && source) {
          event.preventDefault();
          const itemValue = source.getItemValue();
          if (itemValue !== undefined && !source.isDisabledState()) {
            this.toggleItem(itemValue, source);
          }
        }
        break;
    }
  }

  writeValue(value: PuiToggleGroupSelection | null): void {
    if (this.multiple()) {
      this.value.set(Array.isArray(value) ? [...value] : []);
      return;
    }

    this.value.set(Array.isArray(value) ? (value[0] ?? null) : (value ?? null));
  }

  registerOnChange(fn: (value: PuiToggleGroupSelection) => void): void {
    this.cva.registerOnChange(fn);
  }

  registerOnTouched(fn: () => void): void {
    this.cva.registerOnTouched(fn);
  }

  setDisabledState(isDisabled: boolean): void {
    this.cva.setDisabledState(isDisabled);
  }

  private singleValue(): PuiSelectionValue | null {
    const current = this.value();
    if (this.isMultiValue(current)) {
      return current[0] ?? null;
    }
    return current;
  }

  private multiValues(): readonly PuiSelectionValue[] {
    const current = this.value();
    if (this.isMultiValue(current)) {
      return current;
    }
    return current !== null ? [current] : [];
  }

  private isMultiValue(
    value: PuiToggleGroupSelection
  ): value is readonly PuiSelectionValue[] {
    return Array.isArray(value);
  }

  private commit(next: PuiToggleGroupSelection): void {
    this.value.set(next);
    this.cva.commit(next);
    this.selectionChange.emit(next);
  }

  private resolveRovingIndex(items: readonly PuiToggleComponent[]): number {
    const pressedIndex = items.findIndex((toggle) => toggle.isPressedState());
    if (pressedIndex >= 0) {
      return pressedIndex;
    }

    const stored = this.rovingIndex();
    if (stored >= 0 && stored < items.length && !items[stored]?.isDisabledState()) {
      return stored;
    }

    return items.findIndex((toggle) => !toggle.isDisabledState());
  }

  private syncRovingIndex(source: PuiToggleComponent): void {
    const index = this.toggles().findIndex((toggle) => toggle === source);
    if (index >= 0) {
      this.rovingIndex.set(index);
    }
  }

  private nextEnabledIndex(
    items: { index: number; toggle: PuiToggleComponent; disabled: boolean }[],
    startIndex: number,
    direction: 1 | -1
  ): number {
    return findNextEnabledIndex(items, startIndex, direction);
  }

  private focusToggleAt(index: number, selectOnNavigate: boolean): void {
    const toggle = this.toggles()[index];
    if (!toggle || toggle.isDisabledState()) {
      return;
    }

    this.rovingIndex.set(index);

    const itemValue = toggle.getItemValue();
    if (selectOnNavigate && itemValue !== undefined) {
      this.commit(itemValue);
    }

    toggle.focusNative();
  }
}

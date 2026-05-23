import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import { CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  TemplateRef,
  booleanAttribute,
  computed,
  contentChild,
  contentChildren,
  effect,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { PuiSize } from '../../types/common.types';
import { PuiOptionComponent } from './option.component';
import {
  PUI_SELECT_DEFAULT_ITEM_HEIGHT,
  PUI_SELECT_DEFAULT_MAX_PANEL_HEIGHT,
  PUI_SELECT_OVERLAY_POSITIONS,
  PUI_SELECT_SEARCH_DEBOUNCE_MS,
  PUI_SELECT_TYPEAHEAD_RESET_MS,
} from './select.constants';
import {
  coerceSelectValue,
  hasSelectValue,
  resolveTriggerDisplay,
} from './select-value.utils';
import type {
  PuiSelectFilterFn,
  PuiSelectOption,
  PuiSelectOptionTemplateContext,
  PuiSelectSelectionChange,
  PuiSelectTheme,
  PuiSelectValue,
} from './select.types';
import {
  createDefaultFilterFn,
  findNextEnabledIndex,
  findOptionIndex,
  findTypeaheadIndex,
  isMultipleValue,
  isOptionSelected,
  normalizeOptions,
  resolveThemeContext,
  toggleMultipleValue,
  valuesEqual,
} from './select.utils';

@Component({
  selector: 'pui-select',
  imports: [
    CdkConnectedOverlay,
    CdkOverlayOrigin,
    CdkVirtualScrollViewport,
    CdkFixedSizeVirtualScroll,
    CdkVirtualForOf,
    NgTemplateOutlet,
  ],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PuiSelectComponent),
      multi: true,
    },
  ],
  host: {
    class: 'pui-select',
    '[class.pui-select--sm]': "size() === 'sm'",
    '[class.pui-select--md]': "size() === 'md'",
    '[class.pui-select--lg]': "size() === 'lg'",
    '[class.pui-select--open]': 'isOpen()',
    '[class.pui-select--disabled]': 'isDisabled()',
    '[class.pui-select--multiple]': 'multiple()',
    '[class.pui-select--loading]': 'loading()',
    '[class.pui-select--has-value]': 'hasValue()',
    '(keydown)': 'handleHostKeydown($event)',
  },
})
export class PuiSelectComponent implements ControlValueAccessor {
  private static nextId = 0;

  private readonly hostRef = inject(ElementRef<HTMLElement>);
  private readonly uid = PuiSelectComponent.nextId++;

  readonly options = input<readonly PuiSelectOption[]>([]);
  readonly labelKey = input('label');
  readonly valueKey = input('value');
  readonly value = model<PuiSelectValue>(null);
  readonly multiple = input(false, { transform: booleanAttribute });
  readonly searchable = input(false, { transform: booleanAttribute });
  readonly virtualScroll = input(false, { transform: booleanAttribute });
  readonly clearable = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });
  readonly placeholder = input<string | null>(null);
  readonly itemHeight = input(PUI_SELECT_DEFAULT_ITEM_HEIGHT);
  readonly maxPanelHeight = input(PUI_SELECT_DEFAULT_MAX_PANEL_HEIGHT);
  readonly size = input<PuiSize>('md');
  readonly asyncSearch = input(false, { transform: booleanAttribute });
  readonly filterFn = input<PuiSelectFilterFn | null>(null);
  readonly ariaLabel = input<string | null>(null);
  readonly emptyMessage = input('No results found');
  readonly multiDisplay = input<'chips' | 'text'>('chips');

  readonly selectionChange = output<PuiSelectSelectionChange>();
  readonly openChange = output<boolean>();
  readonly searchChange = output<string>();

  private readonly projectedOptions = contentChildren(PuiOptionComponent);
  private readonly optionTemplateRef = contentChild('optionTemplate', { read: TemplateRef });
  private readonly emptyTemplateRef = contentChild('emptyTemplate', { read: TemplateRef });
  private readonly triggerRef = viewChild.required<ElementRef<HTMLButtonElement>>('triggerButton');
  private readonly searchInputRef = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  private onChange: (value: PuiSelectValue) => void = () => {};
  private onTouched: () => void = () => {};
  private readonly formDisabled = signal(false);

  private typeaheadBuffer = '';
  private typeaheadTimer: ReturnType<typeof setTimeout> | null = null;
  private searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;

  protected readonly overlayPositions = PUI_SELECT_OVERLAY_POSITIONS;
  protected readonly overlayPanelClass = 'pui-select__overlay-pane';
  protected readonly isOpen = signal(false);
  protected readonly searchQuery = signal('');
  protected readonly activeIndex = signal(-1);
  protected readonly triggerWidth = signal(0);
  protected readonly panelTheme = signal<PuiSelectTheme>('light');

  protected readonly listboxId = `pui-select-listbox-${this.uid}`;
  protected readonly triggerId = `pui-select-trigger-${this.uid}`;

  protected readonly isDisabled = computed(() => this.disabled() || this.formDisabled());

  protected readonly resolvedOptions = computed(() => {
    const projected = this.projectedOptions();

    if (projected.length > 0) {
      return projected.map((option) => ({
        label: option.resolvedLabel(),
        value: option.value(),
        disabled: option.disabled(),
      }));
    }

    return normalizeOptions(this.options(), this.labelKey(), this.valueKey());
  });

  protected readonly normalizedValue = computed(() =>
    coerceSelectValue(this.value(), this.multiple())
  );

  protected readonly hasValue = computed(() =>
    hasSelectValue(this.normalizedValue(), this.multiple())
  );

  protected readonly triggerDisplay = computed(() =>
    resolveTriggerDisplay(
      this.normalizedValue(),
      this.resolvedOptions(),
      this.multiple(),
      this.labelKey(),
      this.multiDisplay()
    )
  );

  protected readonly filteredOptions = computed(() => {
    const options = this.resolvedOptions();

    if (!this.searchable() || this.asyncSearch()) {
      return options;
    }

    const query = this.searchQuery().trim();
    if (!query) {
      return options;
    }

    const filter = this.filterFn() ?? createDefaultFilterFn(this.labelKey());
    return options.filter((option) => filter(option, query));
  });

  protected readonly viewportHeight = computed(() => {
    const count = this.filteredOptions().length;
    const itemHeight = this.itemHeight();
    const maxHeight = this.maxPanelHeight();
    return Math.min(Math.max(count, 1) * itemHeight, maxHeight);
  });

  protected readonly activeDescendantId = computed(() => {
    const index = this.activeIndex();
    if (index < 0) {
      return null;
    }
    return this.getOptionId(index);
  });

  protected readonly optionTemplate = computed(
    () => this.optionTemplateRef() as TemplateRef<PuiSelectOptionTemplateContext> | undefined
  );

  protected readonly emptyTemplate = computed(
    () => this.emptyTemplateRef() as TemplateRef<unknown> | undefined
  );

  constructor() {
    effect(() => {
      if (!this.isOpen()) {
        this.searchQuery.set('');
        this.activeIndex.set(-1);
      }
    });
  }

  writeValue(value: PuiSelectValue): void {
    this.value.set(coerceSelectValue(value, this.multiple()));
  }

  registerOnChange(fn: (value: PuiSelectValue) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
  }

  protected togglePanel(): void {
    if (this.isDisabled() || this.loading()) {
      return;
    }

    if (this.isOpen()) {
      this.closePanel();
      return;
    }

    this.openPanel();
  }

  protected openPanel(): void {
    if (this.isDisabled() || this.loading()) {
      return;
    }

    this.updateTriggerWidth();
    this.panelTheme.set(resolveThemeContext(this.hostRef.nativeElement));
    this.isOpen.set(true);
    this.openChange.emit(true);
    this.syncActiveIndexToValue();

    queueMicrotask(() => {
      if (this.searchable()) {
        this.searchInputRef()?.nativeElement.focus();
        return;
      }
      this.triggerRef().nativeElement.focus();
    });
  }

  protected closePanel(): void {
    if (!this.isOpen()) {
      return;
    }

    this.isOpen.set(false);
    this.openChange.emit(false);
    this.onTouched();
    this.triggerRef().nativeElement.focus();
  }

  protected handleTriggerKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp':
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.openPanel();
        break;
      case 'Escape':
        event.preventDefault();
        this.closePanel();
        break;
      default:
        if (this.isTypeaheadKey(event.key)) {
          event.preventDefault();
          this.handleTypeahead(event.key);
        }
        break;
    }
  }

  protected handlePanelKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.moveActiveIndex(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.moveActiveIndex(-1);
        break;
      case 'Enter':
        event.preventDefault();
        this.selectActiveOption();
        break;
      case 'Escape':
        event.preventDefault();
        this.closePanel();
        break;
      case 'Tab':
        this.closePanel();
        break;
      case 'Home':
        event.preventDefault();
        this.setActiveIndex(findNextEnabledIndex(this.filteredOptions(), -1, 1));
        break;
      case 'End':
        event.preventDefault();
        this.setActiveIndex(
          findNextEnabledIndex(this.filteredOptions(), this.filteredOptions().length, -1)
        );
        break;
      default:
        if (!this.searchable() && this.isTypeaheadKey(event.key)) {
          event.preventDefault();
          this.handleTypeahead(event.key);
        }
        break;
    }
  }

  protected handleHostKeydown(event: KeyboardEvent): void {
    if (!this.isOpen()) {
      return;
    }
    this.handlePanelKeydown(event);
  }

  protected handleSearchInput(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.searchQuery.set(query);
    this.activeIndex.set(-1);

    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }

    if (this.asyncSearch()) {
      this.searchDebounceTimer = setTimeout(() => {
        this.searchChange.emit(query);
      }, PUI_SELECT_SEARCH_DEBOUNCE_MS);
      return;
    }

    this.searchChange.emit(query);
  }

  protected handleOptionClick(option: PuiSelectOption, index: number): void {
    if (option.disabled) {
      return;
    }

    this.setActiveIndex(index);
    this.commitSelection(option);
  }

  protected handleClear(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.updateValue(this.multiple() ? [] : null, null);
  }

  protected handleRemoveChip(event: MouseEvent, chipValue: string | number): void {
    event.preventDefault();
    event.stopPropagation();

    const current = this.normalizedValue();
    if (!this.multiple() || !isMultipleValue(current)) {
      return;
    }

    const nextValue = Object.freeze(
      current.filter((entry) => !valuesEqual(entry, chipValue))
    ) as readonly (string | number)[];
    const option =
      this.resolvedOptions().find((entry) => valuesEqual(entry.value, chipValue)) ?? null;
    this.updateValue(nextValue, option);
  }

  protected isSelected(option: PuiSelectOption): boolean {
    return isOptionSelected(this.normalizedValue(), option.value, this.multiple());
  }

  protected isActive(index: number): boolean {
    return this.activeIndex() === index;
  }

  protected getOptionId(index: number): string {
    return `${this.listboxId}-option-${index}`;
  }

  protected trackOption = (_index: number, option: PuiSelectOption): string | number => option.value;

  protected buildOptionContext(option: PuiSelectOption, index: number): PuiSelectOptionTemplateContext {
    return {
      $implicit: option,
      selected: this.isSelected(option),
      active: this.isActive(index),
      index,
    };
  }

  private updateTriggerWidth(): void {
    this.triggerWidth.set(this.triggerRef().nativeElement.getBoundingClientRect().width);
  }

  private syncActiveIndexToValue(): void {
    const current = this.normalizedValue();
    const options = this.filteredOptions();

    if (this.multiple() || isMultipleValue(current) || current === null) {
      this.activeIndex.set(findNextEnabledIndex(options, -1, 1));
      return;
    }

    const index = findOptionIndex(options, current);
    this.activeIndex.set(index >= 0 ? index : findNextEnabledIndex(options, -1, 1));
  }

  private moveActiveIndex(direction: 1 | -1): void {
    const options = this.filteredOptions();
    const nextIndex = findNextEnabledIndex(options, this.activeIndex(), direction);
    this.setActiveIndex(nextIndex);
  }

  private setActiveIndex(index: number): void {
    this.activeIndex.set(index);
  }

  private selectActiveOption(): void {
    const index = this.activeIndex();
    const option = this.filteredOptions()[index];
    if (!option || option.disabled) {
      return;
    }
    this.commitSelection(option);
  }

  private commitSelection(option: PuiSelectOption): void {
    let nextValue: PuiSelectValue;

    if (this.multiple()) {
      const current = this.normalizedValue();
      const currentValues = isMultipleValue(current) ? current : [];
      nextValue = toggleMultipleValue(currentValues, option.value);
    } else {
      nextValue = option.value;
      this.closePanel();
    }

    this.updateValue(nextValue, option);
  }

  private updateValue(nextValue: PuiSelectValue, option: PuiSelectOption | null): void {
    const normalized = coerceSelectValue(nextValue, this.multiple());
    this.value.set(normalized);
    this.onChange(normalized);
    this.onTouched();
    this.selectionChange.emit({ value: normalized, option });
  }

  private handleTypeahead(char: string): void {
    this.typeaheadBuffer += char.toLowerCase();

    if (this.typeaheadTimer) {
      clearTimeout(this.typeaheadTimer);
    }

    this.typeaheadTimer = setTimeout(() => {
      this.typeaheadBuffer = '';
    }, PUI_SELECT_TYPEAHEAD_RESET_MS);

    if (!this.isOpen()) {
      this.openPanel();
    }

    const index = findTypeaheadIndex(this.filteredOptions(), this.typeaheadBuffer, this.activeIndex());
    if (index >= 0) {
      this.setActiveIndex(index);
    }
  }

  private isTypeaheadKey(key: string): boolean {
    return key.length === 1 && !/\s/.test(key);
  }
}

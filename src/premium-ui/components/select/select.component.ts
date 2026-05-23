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
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import type { PuiSize } from '../../types/common.types';
import { PuiCvaBridge, providePuiCva } from '../../internal/forms';
import { isTypeaheadKey, PUI_KEYS } from '../../internal/keyboard';
import { PuiDataProcessorService } from '../../internal/workers';
import { PuiOptionComponent } from './option.component';
import { PuiCheckboxComponent } from '../checkbox/checkbox.component';
import {
  PUI_SELECT_DEFAULT_ITEM_HEIGHT,
  PUI_SELECT_DEFAULT_MAX_PANEL_HEIGHT,
  PUI_SELECT_OVERLAY_POSITIONS,
  PUI_SELECT_SEARCH_DEBOUNCE_MS,
  PUI_SELECT_TYPEAHEAD_RESET_MS,
  PUI_SELECT_WORKER_DEBOUNCE_MS,
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
import { mapSelectOptionsByIndices, toSelectWorkerDataset } from './select-worker.utils';

@Component({
  selector: 'pui-select',
  imports: [
    CdkConnectedOverlay,
    CdkOverlayOrigin,
    CdkVirtualScrollViewport,
    CdkFixedSizeVirtualScroll,
    CdkVirtualForOf,
    NgTemplateOutlet,
    PuiCheckboxComponent,
  ],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [providePuiCva(PuiSelectComponent)],
  host: {
    class: 'pui-select',
    '[class.pui-select--sm]': "size() === 'sm'",
    '[class.pui-select--md]': "size() === 'md'",
    '[class.pui-select--lg]': "size() === 'lg'",
    '[class.pui-select--open]': 'isOpen()',
    '[class.pui-select--disabled]': 'isDisabled()',
    '[class.pui-select--multiple]': 'multiple()',
    '[class.pui-select--loading]': 'loading() || workerSearchLoading()',
    '[class.pui-select--has-value]': 'hasValue()',
    '[class.pui-select--worker]': 'useWorker()',
    '(keydown)': 'handleHostKeydown($event)',
  },
})
export class PuiSelectComponent implements ControlValueAccessor {
  private static nextId = 0;

  private readonly hostRef = inject(ElementRef<HTMLElement>);
  private readonly cva = new PuiCvaBridge<PuiSelectValue>();
  private readonly dataProcessor = inject(PuiDataProcessorService);
  private readonly uid = PuiSelectComponent.nextId++;
  private readonly datasetId = `pui-select-${this.uid}`;
  private workerSearchToken = 0;

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
  readonly useWorker = input(false, { transform: booleanAttribute });
  readonly fuzzySearch = input(false, { transform: booleanAttribute });
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
  protected readonly workerFilteredIndices = signal<readonly number[] | null>(null);
  protected readonly workerSearchLoading = signal(false);

  protected readonly listboxId = `pui-select-listbox-${this.uid}`;
  protected readonly triggerId = `pui-select-trigger-${this.uid}`;

  protected readonly isDisabled = computed(() => this.disabled() || this.cva.formDisabled());

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

    if (this.useWorker()) {
      const indices = this.workerFilteredIndices();
      if (indices === null) {
        return options;
      }
      return mapSelectOptionsByIndices(options, indices);
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

    effect(() => {
      const useWorker = this.useWorker();
      const searchable = this.searchable();
      const asyncSearch = this.asyncSearch();
      const options = this.resolvedOptions();
      const query = this.searchQuery();
      const fuzzy = this.fuzzySearch();

      if (!useWorker || !searchable || asyncSearch) {
        this.workerFilteredIndices.set(null);
        this.workerSearchLoading.set(false);
        return;
      }

      const token = ++this.workerSearchToken;
      const items = toSelectWorkerDataset(options);
      const trimmed = query.trim();

      if (!trimmed) {
        this.workerFilteredIndices.set(options.map((_, index) => index));
        this.workerSearchLoading.set(false);
        return;
      }

      this.workerSearchLoading.set(true);

      void this.dataProcessor
        .searchIndices({
          useWorker: true,
          datasetId: this.datasetId,
          items,
          query: trimmed,
          mode: fuzzy ? 'fuzzy' : 'text',
          debounceMs: PUI_SELECT_WORKER_DEBOUNCE_MS,
        })
        .then((indices) => {
          if (token !== this.workerSearchToken) {
            return;
          }
          this.workerFilteredIndices.set(indices);
          this.workerSearchLoading.set(false);
        });
    });
  }

  writeValue(value: PuiSelectValue): void {
    this.value.set(coerceSelectValue(value, this.multiple()));
  }

  registerOnChange(fn: (value: PuiSelectValue) => void): void {
    this.cva.registerOnChange(fn);
  }

  registerOnTouched(fn: () => void): void {
    this.cva.registerOnTouched(fn);
  }

  setDisabledState(isDisabled: boolean): void {
    this.cva.setDisabledState(isDisabled);
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
    this.cva.markTouched();
    this.triggerRef().nativeElement.focus();
  }

  protected handleTriggerKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case PUI_KEYS.ARROW_DOWN:
      case PUI_KEYS.ARROW_UP:
      case PUI_KEYS.ENTER:
      case PUI_KEYS.SPACE:
        event.preventDefault();
        this.openPanel();
        break;
      case PUI_KEYS.ESCAPE:
        event.preventDefault();
        this.closePanel();
        break;
      default:
        if (isTypeaheadKey(event.key)) {
          event.preventDefault();
          this.handleTypeahead(event.key);
        }
        break;
    }
  }

  protected handlePanelKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case PUI_KEYS.ARROW_DOWN:
        event.preventDefault();
        this.moveActiveIndex(1);
        break;
      case PUI_KEYS.ARROW_UP:
        event.preventDefault();
        this.moveActiveIndex(-1);
        break;
      case PUI_KEYS.ENTER:
        event.preventDefault();
        this.selectActiveOption();
        break;
      case PUI_KEYS.ESCAPE:
        event.preventDefault();
        this.closePanel();
        break;
      case PUI_KEYS.TAB:
        this.closePanel();
        break;
      case PUI_KEYS.HOME:
        event.preventDefault();
        this.setActiveIndex(findNextEnabledIndex(this.filteredOptions(), -1, 1));
        break;
      case PUI_KEYS.END:
        event.preventDefault();
        this.setActiveIndex(
          findNextEnabledIndex(this.filteredOptions(), this.filteredOptions().length, -1)
        );
        break;
      default:
        if (!this.searchable() && isTypeaheadKey(event.key)) {
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

  protected handleOptionKeydown(
    event: KeyboardEvent,
    option: PuiSelectOption,
    index: number
  ): void {
    if (option.disabled) {
      return;
    }

    if (event.key === PUI_KEYS.ENTER || event.key === PUI_KEYS.SPACE) {
      event.preventDefault();
      this.setActiveIndex(index);
      this.commitSelection(option);
    }
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
    this.cva.emitChange(normalized);
    this.cva.markTouched();
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
}

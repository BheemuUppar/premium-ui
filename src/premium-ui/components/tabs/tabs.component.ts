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
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { PuiCvaBridge, providePuiCva } from '../../internal/forms';
import { PUI_KEYS } from '../../internal/keyboard';
import { PUI_TABS } from '../../internal/selection/tabs.token';
import { findNextEnabledIndex } from '../../internal/selection/selection.utils';
import { PuiTabItemComponent } from './tab-item.component';
import { PuiTabPanelComponent } from './tab-panel.component';
import type { PuiTabsOrientation, PuiTabsSize, PuiTabsVariant } from './tabs.types';
import { isSlidingIndicatorVariant } from './tabs.utils';

@Component({
  selector: 'pui-tabs',
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: PUI_TABS, useExisting: forwardRef(() => PuiTabsComponent) },
    providePuiCva(PuiTabsComponent),
  ],
  host: {
    class: 'pui-tabs',
    '[class.pui-tabs--underline]': "variant() === 'underline'",
    '[class.pui-tabs--segmented]': "variant() === 'segmented'",
    '[class.pui-tabs--segmented-soft]': "variant() === 'segmented-soft'",
    '[class.pui-tabs--pill]': "variant() === 'pill'",
    '[class.pui-tabs--horizontal]': "orientation() === 'horizontal'",
    '[class.pui-tabs--vertical]': "orientation() === 'vertical'",
    '[class.pui-tabs--sm]': "size() === 'sm'",
    '[class.pui-tabs--md]': "size() === 'md'",
    '[class.pui-tabs--lg]': "size() === 'lg'",
    '[class.pui-tabs--disabled]': 'isDisabled()',
    '[class.pui-tabs--full-width]': 'fullWidth()',
    '[style.--pui-tabs-indicator-index]': 'indicatorIndex()',
    '[style.--pui-tabs-indicator-count]': 'indicatorCount()',
    '(keydown)': 'handleListKeydown($event)',
  },
})
export class PuiTabsComponent implements ControlValueAccessor {
  private readonly cva = new PuiCvaBridge<string>();
  private readonly tabItems = contentChildren(PuiTabItemComponent);
  private readonly tabPanels = contentChildren(PuiTabPanelComponent);

  readonly variant = input<PuiTabsVariant>('underline');
  readonly orientation = input<PuiTabsOrientation>('horizontal');
  readonly size = input<PuiTabsSize>('md');
  readonly ariaLabel = input<string>('Tabs');
  readonly defaultValue = input<string>('');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly fullWidth = input(false, { transform: booleanAttribute });
  readonly value = model<string>('');

  readonly selectionChange = output<string>();

  protected readonly showIndicator = computed(() => isSlidingIndicatorVariant(this.variant()));

  protected readonly indicatorIndex = computed(() => {
    if (!this.showIndicator()) {
      return 0;
    }

    const items = this.tabItems();
    const current = this.value();
    const index = items.findIndex((item) => item.tabId() === current);
    return index >= 0 ? index : 0;
  });

  protected readonly indicatorCount = computed(() => Math.max(this.tabItems().length, 1));

  constructor() {
    effect(() => {
      const items = this.tabItems();
      if (items.length === 0) {
        return;
      }

      const ids = items.map((item) => item.tabId());
      const requested = this.value() || this.defaultValue();
      const fallback = items.find((item) => !item.isDisabledState())?.tabId() ?? ids[0];
      const selected = requested && ids.includes(requested) ? requested : fallback;

      if (this.value() !== selected) {
        this.value.set(selected);
      }

      this.syncPanelVisibility(selected);
    });
  }

  isDisabled(): boolean {
    return this.disabled() || this.cva.formDisabled();
  }

  isSelected(tabId: string): boolean {
    return this.value() === tabId;
  }

  hasSlidingIndicator(): boolean {
    return this.showIndicator();
  }

  variantType(): PuiTabsVariant {
    return this.variant();
  }

  orientationType(): PuiTabsOrientation {
    return this.orientation();
  }

  selectTab(tabId: string): void {
    if (this.isDisabled()) {
      return;
    }

    const item = this.tabItems().find((entry) => entry.tabId() === tabId);
    if (!item || item.isDisabledState()) {
      return;
    }

    this.applySelection(tabId, true);
  }

  focusTab(tabId: string): void {
    const item = this.tabItems().find((entry) => entry.tabId() === tabId);
    item?.focusNative();
  }

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.cva.registerOnChange(fn);
  }

  registerOnTouched(fn: () => void): void {
    this.cva.registerOnTouched(fn);
  }

  setDisabledState(isDisabled: boolean): void {
    this.cva.setDisabledState(isDisabled);
  }

  markTouched(): void {
    this.cva.markTouched();
  }

  handleListKeydown(event: KeyboardEvent): void {
    const items = this.tabItems().map((tab, index) => ({
      index,
      tab,
      disabled: tab.isDisabledState(),
    }));

    if (items.length === 0) {
      return;
    }

    const activeElement = event.target;
    const source = items.find((entry) => entry.tab.containsElement(activeElement))?.tab;
    const currentIndex = source
      ? items.findIndex((entry) => entry.tab === source)
      : items.findIndex((entry) => entry.tab.tabId() === this.value());

    const activeIndex = currentIndex >= 0 ? currentIndex : 0;
    const isHorizontal = this.orientation() === 'horizontal';
    let nextIndex: number;

    switch (event.key) {
      case PUI_KEYS.ARROW_DOWN:
        if (isHorizontal) {
          return;
        }
        event.preventDefault();
        nextIndex = findNextEnabledIndex(items, activeIndex, 1);
        break;
      case PUI_KEYS.ARROW_UP:
        if (isHorizontal) {
          return;
        }
        event.preventDefault();
        nextIndex = findNextEnabledIndex(items, activeIndex, -1);
        break;
      case PUI_KEYS.ARROW_RIGHT:
        if (!isHorizontal) {
          return;
        }
        event.preventDefault();
        nextIndex = findNextEnabledIndex(items, activeIndex, 1);
        break;
      case PUI_KEYS.ARROW_LEFT:
        if (!isHorizontal) {
          return;
        }
        event.preventDefault();
        nextIndex = findNextEnabledIndex(items, activeIndex, -1);
        break;
      case PUI_KEYS.HOME:
        event.preventDefault();
        nextIndex = findNextEnabledIndex(items, -1, 1);
        break;
      case PUI_KEYS.END:
        event.preventDefault();
        nextIndex = findNextEnabledIndex(items, items.length, -1);
        break;
      default:
        return;
    }

    const next = items[nextIndex];
    if (next && !next.disabled) {
      this.selectTab(next.tab.tabId());
      next.tab.focusNative();
    }
  }

  private applySelection(tabId: string, emit: boolean): void {
    if (this.value() === tabId) {
      this.syncPanelVisibility(tabId);
      return;
    }

    this.value.set(tabId);
    this.syncPanelVisibility(tabId);

    if (emit) {
      this.cva.commit(tabId);
      this.selectionChange.emit(tabId);
      this.markTouched();
    }
  }

  private syncPanelVisibility(selectedId: string): void {
    for (const panel of this.tabPanels()) {
      panel.setActive(panel.panelTabId() === selectedId);
    }
  }
}

/** @deprecated Use PuiTabsComponent */
export { PuiTabsComponent as TabsComponent };

import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  booleanAttribute,
  computed,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { PUI_TABS } from '../../internal/selection/tabs.token';

@Component({
  selector: 'pui-tab-item',
  templateUrl: './tab-item.component.html',
  styleUrl: './tab-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'pui-tab-item',
    role: 'tab',
    '[attr.id]': 'id()',
    '[attr.data-variant]': 'variant()',
    '[attr.data-orientation]': 'orientation()',
    '[class.pui-tab-item--selected]': 'isSelected()',
    '[class.pui-tab-item--sliding]': 'hasSlidingIndicator()',
  },
})
export class PuiTabItemComponent {
  private readonly tabs = inject(PUI_TABS, { optional: true });
  private readonly buttonRef = viewChild<ElementRef<HTMLButtonElement>>('tabButton');

  readonly id = input.required<string>();
  readonly label = input.required<string>();
  readonly panelId = input<string>('');
  readonly badge = input<number | boolean | null>(null);
  readonly disabled = input(false, { transform: booleanAttribute });

  protected readonly isSelected = computed(() => this.tabs?.isSelected(this.id()) ?? false);
  protected readonly isDisabled = computed(
    () => this.disabled() || (this.tabs?.isDisabled() ?? false)
  );
  protected readonly hasSlidingIndicator = computed(() => this.tabs?.hasSlidingIndicator() ?? false);
  protected readonly variant = computed(() => this.tabs?.variantType() ?? 'underline');
  protected readonly orientation = computed(() => this.tabs?.orientationType() ?? 'horizontal');

  tabId(): string {
    return this.id();
  }

  isDisabledState(): boolean {
    return this.isDisabled();
  }

  containsElement(element: EventTarget | null): boolean {
    if (!(element instanceof Node)) {
      return false;
    }

    return this.buttonRef()?.nativeElement.contains(element) ?? false;
  }

  focusNative(): void {
    this.buttonRef()?.nativeElement.focus();
  }

  onClick(): void {
    this.tabs?.selectTab(this.id());
  }
}

/** @deprecated Use PuiTabItemComponent */
export { PuiTabItemComponent as TabItemComponent };

import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';

@Component({
  selector: 'pui-tab-panel',
  templateUrl: './tab-panel.component.html',
  styleUrl: './tab-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'pui-tab-panel-host',
    '[class.pui-tab-panel-host--active]': 'isActive()',
  },
})
export class PuiTabPanelComponent {
  readonly tabId = input.required<string>();

  private readonly activeSignal = signal(false);
  protected readonly isActive = this.activeSignal.asReadonly();

  panelTabId(): string {
    return this.tabId();
  }

  setActive(value: boolean): void {
    this.activeSignal.set(value);
  }
}

/** @deprecated Use PuiTabPanelComponent */
export { PuiTabPanelComponent as TabPanelComponent };

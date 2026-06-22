import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { type PuiDateIconName, resolveDateIconPaths } from '../../core/icons/date-icons';

@Component({
  selector: 'pui-date-icon',
  template: `
    <svg
      class="pui-date-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      @for (path of paths(); track path) {
        <path [attr.d]="path" />
      }
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      line-height: 0;
    }

    .pui-date-icon {
      width: 1em;
      height: 1em;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PuiDateIconComponent {
  readonly name = input.required<PuiDateIconName>();
  protected readonly paths = computed(() => resolveDateIconPaths(this.name()));
}

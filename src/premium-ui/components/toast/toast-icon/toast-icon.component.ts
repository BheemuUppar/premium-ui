import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { PUI_TOAST_ICON_PATHS, type PuiToastIconName } from '../toast-icons';

@Component({
  selector: 'pui-toast-icon',
  template: `
    @if (paths().length > 0) {
      <svg
        class="pui-toast-icon__svg"
        [class.pui-toast-icon__svg--spin]="spinning()"
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
    }
  `,
  styles: `
    :host {
      display: inline-flex;
      width: var(--pui-toast-icon-size, 1.125rem);
      height: var(--pui-toast-icon-size, 1.125rem);
      flex-shrink: 0;
    }

    .pui-toast-icon__svg {
      width: 100%;
      height: 100%;
    }

    .pui-toast-icon__svg--spin {
      animation: pui-toast-icon-spin 0.85s linear infinite;
    }

    @keyframes pui-toast-icon-spin {
      to {
        transform: rotate(360deg);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .pui-toast-icon__svg--spin {
        animation: none;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PuiToastIconComponent {
  readonly name = input.required<PuiToastIconName>();
  readonly spinning = input(false);

  protected readonly paths = computed(() => PUI_TOAST_ICON_PATHS[this.name()] ?? []);
}

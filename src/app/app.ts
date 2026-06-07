import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PuiDialogContainerComponent } from '../premium-ui/components/dialog';
import { PuiToastViewportComponent } from '../premium-ui/components/toast';
import { PuiThemeService } from './docs/services/theme.service';

const SCROLLING_CLASS = 'pui-is-scrolling';
const SCROLL_END_MS = 800;

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PuiToastViewportComponent, PuiDialogContainerComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-theme]': 'themeService.theme()',
  },
})
export class App {
  protected readonly themeService = inject(PuiThemeService);

  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      const timers = new WeakMap<Element, ReturnType<typeof setTimeout>>();

      const handleScroll = (event: Event): void => {
        const target = event.target;
        const element =
          target instanceof Document
            ? document.documentElement
            : target instanceof Element
              ? target
              : null;

        if (!element) {
          return;
        }

        element.classList.add(SCROLLING_CLASS);

        const existing = timers.get(element);
        if (existing !== undefined) {
          clearTimeout(existing);
        }

        timers.set(
          element,
          setTimeout(() => {
            element.classList.remove(SCROLLING_CLASS);
            timers.delete(element);
          }, SCROLL_END_MS)
        );
      };

      document.addEventListener('scroll', handleScroll, { capture: true, passive: true });
      this.destroyRef.onDestroy(() => {
        document.removeEventListener('scroll', handleScroll, { capture: true });
      });
    });
  }
}

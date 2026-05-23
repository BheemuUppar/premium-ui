import { ChangeDetectionStrategy, Component, booleanAttribute, input, output } from '@angular/core';
import type { PuiCardLayout, PuiCardSize, PuiCardVariant } from './card.types';

@Component({
  selector: 'pui-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.pui-card--default]': "variant() === 'default'",
    '[class.pui-card--outlined]': "variant() === 'outlined'",
    '[class.pui-card--elevated]': "variant() === 'elevated'",
    '[class.pui-card--ghost]': "variant() === 'ghost'",
    '[class.pui-card--glass]': "variant() === 'glass'",
    '[class.pui-card--gradient]': "variant() === 'gradient'",
    '[class.pui-card--sm]': "size() === 'sm'",
    '[class.pui-card--md]': "size() === 'md'",
    '[class.pui-card--lg]': "size() === 'lg'",
    '[class.pui-card--vertical]': "layout() === 'vertical'",
    '[class.pui-card--horizontal]': "layout() === 'horizontal'",
    '[class.pui-card--hoverable]': 'hoverable()',
    '[class.pui-card--interactive]': 'interactive()',
    '[class.pui-card--disabled]': 'disabled()',
    '[class.pui-card--loading]': 'loading()',
    '[class.pui-card--highlighted]': 'highlighted()',
    '[class.pui-card--image-zoom]': 'imageZoom()',
    '[attr.role]': "interactive() ? 'button' : null",
    '[attr.tabindex]': "interactive() && !disabled() ? 0 : null",
    '[attr.aria-disabled]': "disabled() ? 'true' : null",
    '[attr.aria-busy]': "loading() ? 'true' : null",
    '(click)': 'handleClick($event)',
    '(keydown.enter)': 'handleActivate($event)',
    '(keydown.space)': 'handleActivate($event)',
  },
})
export class PuiCardComponent {
  readonly variant = input<PuiCardVariant>('default');
  readonly size = input<PuiCardSize>('md');
  readonly layout = input<PuiCardLayout>('vertical');
  readonly hoverable = input(false, { transform: booleanAttribute });
  readonly interactive = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });
  readonly highlighted = input(false, { transform: booleanAttribute });
  readonly imageZoom = input(false, { transform: booleanAttribute });

  readonly pressed = output<MouseEvent | KeyboardEvent>();

  protected handleClick(event: MouseEvent): void {
    if (!this.interactive() || this.disabled() || this.loading()) {
      return;
    }
    this.pressed.emit(event);
  }

  protected handleActivate(event: Event): void {
    if (!this.interactive() || this.disabled() || this.loading()) {
      return;
    }
    event.preventDefault();
    this.pressed.emit(event as KeyboardEvent);
  }
}

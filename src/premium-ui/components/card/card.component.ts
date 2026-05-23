import { ChangeDetectionStrategy, Component, booleanAttribute, input } from '@angular/core';
import type { PuiCardSize, PuiCardVariant } from './card.types';

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
    '[class.pui-card--sm]': "size() === 'sm'",
    '[class.pui-card--md]': "size() === 'md'",
    '[class.pui-card--lg]': "size() === 'lg'",
    '[class.pui-card--hoverable]': 'hoverable()',
    '[class.pui-card--interactive]': 'interactive()',
    '[class.pui-card--disabled]': 'disabled()',
    '[attr.role]': "interactive() ? 'button' : null",
    '[attr.tabindex]': "interactive() && !disabled() ? 0 : null",
    '[attr.aria-disabled]': "disabled() ? 'true' : null",
  },
})
export class PuiCardComponent {
  readonly variant = input<PuiCardVariant>('default');
  readonly size = input<PuiCardSize>('md');
  readonly hoverable = input(false, { transform: booleanAttribute });
  readonly interactive = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
}

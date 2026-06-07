import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input, output } from '@angular/core';
import type { PuiButtonSize, PuiButtonType, PuiButtonVariant } from './button.types';

@Component({
  selector: 'pui-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.pui-button--primary]': "variant() === 'primary'",
    '[class.pui-button--secondary]': "variant() === 'secondary'",
    '[class.pui-button--outline]': "variant() === 'outline'",
    '[class.pui-button--ghost]': "variant() === 'ghost'",
    '[class.pui-button--danger]': "variant() === 'danger'",
    '[class.pui-button--sm]': "size() === 'sm'",
    '[class.pui-button--md]': "size() === 'md'",
    '[class.pui-button--lg]': "size() === 'lg'"
  }
})
export class PuiButtonComponent {
  readonly variant = input<PuiButtonVariant>('primary');
  readonly size = input<PuiButtonSize>('md');
  readonly type = input<PuiButtonType>('button');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input<string | null>(null);
  readonly click = output<MouseEvent>();

  protected readonly isDisabled = computed(() => this.disabled() || this.loading());

  protected handleClick(event: MouseEvent): void {
    if (this.isDisabled()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    // Prevent the native click from bubbling to the host — (click) on pui-button
    // subscribes to both the output and the host DOM event when they share the name.
    event.stopPropagation();
    this.click.emit(event);
  }
}

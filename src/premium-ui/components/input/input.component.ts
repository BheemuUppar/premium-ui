import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input, output } from '@angular/core';
import type { PuiSize } from '../../types/common.types';
import type { PuiInputType } from './input.types.ts';

@Component({
  selector: 'pui-input',
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.pui-input--sm]': "size() === 'sm'",
    '[class.pui-input--md]': "size() === 'md'",
    '[class.pui-input--lg]': "size() === 'lg'"
  }
})
export class PuiInputComponent {
  readonly type = input<PuiInputType>('text');
  readonly size = input<PuiSize>('md');
  readonly placeholder = input<string | null>(null);
  readonly ariaLabel = input<string | null>(null);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readOnly = input(false, { transform: booleanAttribute });
  readonly value = input('');
  readonly input = output<Event>();
  readonly change = output<Event>();
  readonly focus = output<FocusEvent>();
  readonly blur = output<FocusEvent>();

  protected readonly isInteractive = computed(() => !this.disabled() && !this.readOnly());

  protected handleInput(event: Event): void {
    this.input.emit(event);
  }

  protected handleChange(event: Event): void {
    this.change.emit(event);
  }

  protected handleFocus(event: FocusEvent): void {
    this.focus.emit(event);
  }

  protected handleBlur(event: FocusEvent): void {
    this.blur.emit(event);
  }
}

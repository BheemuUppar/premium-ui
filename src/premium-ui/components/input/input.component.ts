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
  readonly valueChange = output<string>();
  readonly textInput = output<InputEvent>();
  readonly nativeChange = output<Event>();
  readonly focused = output<FocusEvent>();
  readonly blurred = output<FocusEvent>();

  protected readonly isInteractive = computed(() => !this.disabled() && !this.readOnly());

  protected handleInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.valueChange.emit(value);
    this.textInput.emit(event as InputEvent);
  }

  protected handleChange(event: Event): void {
    this.nativeChange.emit(event);
  }

  protected handleFocus(event: FocusEvent): void {
    this.focused.emit(event);
  }

  protected handleBlur(event: FocusEvent): void {
    this.blurred.emit(event);
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import type { PuiToastData } from '../toast.types';
import { PuiToastService } from '../toast.service';
import { PuiToastIconComponent } from '../toast-icon/toast-icon.component';

@Component({
  selector: 'pui-toast',
  imports: [PuiToastIconComponent],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'status',
    '[attr.aria-live]': 'toast().ariaLive',
    '[attr.aria-atomic]': "'true'",
    '[class.pui-toast--default]': "toast().variant === 'default'",
    '[class.pui-toast--success]': "toast().variant === 'success'",
    '[class.pui-toast--error]': "toast().variant === 'error'",
    '[class.pui-toast--warning]': "toast().variant === 'warning'",
    '[class.pui-toast--info]': "toast().variant === 'info'",
    '[class.pui-toast--loading]': "toast().variant === 'loading'",
    '[class.pui-toast--snackbar]': "toast().variant === 'snackbar'",
    '[class.pui-toast--compact]': "toast().variant === 'compact'",
    '[class.pui-toast--rich]': "toast().variant === 'rich'",
    '[class.pui-toast--entering]': "toast().state === 'entering'",
    '[class.pui-toast--visible]': "toast().state === 'visible'",
    '[class.pui-toast--exiting]': "toast().state === 'exiting'",
    '[attr.data-position]': 'toast().position',
    '[class]': 'toast().className ?? null',
    '(mouseenter)': 'handlePointerEnter()',
    '(mouseleave)': 'handlePointerLeave()',
    '(focusin)': 'handlePointerEnter()',
    '(focusout)': 'handlePointerLeave($event)',
  },
})
export class PuiToastComponent {
  private readonly toastService = inject(PuiToastService);

  readonly toast = input.required<PuiToastData>();
  readonly stacked = input(false, { transform: booleanAttribute });

  readonly actionTriggered = output<void>();

  protected readonly showIcon = computed(() => this.toast().showIcon && this.toast().iconName !== null);
  protected readonly variant = computed(() => this.toast().variant);

  protected handleDismiss(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.toastService.dismiss(this.toast().id);
  }

  protected handleDismissKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      this.handleDismiss(event);
    }
  }

  protected handleAction(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.toast().action?.onClick?.();
    this.actionTriggered.emit();
    this.toastService.dismiss(this.toast().id);
  }

  protected handlePointerEnter(): void {
    this.toastService.pause(this.toast().id);
  }

  protected handlePointerLeave(event?: FocusEvent): void {
    const related = event?.relatedTarget;
    if (related instanceof Node && event?.currentTarget instanceof Node) {
      if (event.currentTarget.contains(related)) {
        return;
      }
    }

    this.toastService.resume(this.toast().id);
  }

  protected handleActionKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      this.handleAction(event);
    }
  }
}

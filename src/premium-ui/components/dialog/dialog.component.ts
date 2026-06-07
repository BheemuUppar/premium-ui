import { ChangeDetectionStrategy, Component, booleanAttribute, computed, inject, input } from '@angular/core';
import { PUI_DIALOG_VARIANT } from './dialog.tokens';
import type { PuiDialogVariant } from './dialog.types';

@Component({
  selector: 'pui-dialog',
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'pui-dialog',
    role: 'dialog',
    'aria-modal': 'true',
    '[class.pui-dialog--confirm]': "resolvedVariant() === 'confirm'",
    '[class.pui-dialog--fullscreen]': "resolvedVariant() === 'fullscreen'",
    '[class.pui-dialog--sheet]': "resolvedVariant() === 'sheet'",
    '[class.pui-dialog--danger]': "resolvedVariant() === 'danger'",
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.aria-labelledby]': 'ariaLabelledBy()',
    '[attr.aria-describedby]': 'ariaDescribedBy()',
  },
})
export class PuiDialogComponent {
  private readonly configVariant = inject(PUI_DIALOG_VARIANT, { optional: true });

  readonly variant = input<PuiDialogVariant>();
  readonly ariaLabel = input<string | null>(null);
  readonly ariaLabelledBy = input<string | null>(null);
  readonly ariaDescribedBy = input<string | null>(null);
  readonly closable = input(false, { transform: booleanAttribute });

  /** Input wins; otherwise uses variant from `PuiDialogService.open()` config. */
  protected readonly resolvedVariant = computed(
    () => this.variant() ?? this.configVariant ?? 'default'
  );
}

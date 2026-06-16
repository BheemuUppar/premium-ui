import { Directive, OnDestroy, OnInit, inject, input } from '@angular/core';
import { PuiCommandPaletteService } from '../services/command-palette.service';
import { PuiCommandShortcutService } from '../services/command-shortcut.service';

/**
 * Registers global command palette shortcuts on the host element's document context.
 *
 * @example
 * ```html
 * <body [puiCommandPaletteShortcut]="['meta+k', 'ctrl+k']"></body>
 * ```
 */
@Directive({
  selector: '[puiCommandPaletteShortcut]',
})
export class PuiCommandPaletteShortcutDirective implements OnInit, OnDestroy {
  private readonly paletteService = inject(PuiCommandPaletteService);
  private readonly shortcutService = inject(PuiCommandShortcutService);

  readonly puiCommandPaletteShortcut = input<readonly string[]>(['meta+k', 'ctrl+k']);

  ngOnInit(): void {
    this.paletteService.registerShortcuts(this.puiCommandPaletteShortcut());
    this.shortcutService.trackPointer();
  }

  ngOnDestroy(): void {
    this.shortcutService.release();
    this.shortcutService.untrackPointer();
  }
}

import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { PuiDocKeyboardShortcut } from '../../../docs.types';

@Component({
  selector: 'pui-doc-keyboard-shortcuts',
  templateUrl: './doc-keyboard-shortcuts.component.html',
  styleUrl: './doc-keyboard-shortcuts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PuiDocKeyboardShortcutsComponent {
  readonly title = input('Keyboard navigation');
  readonly shortcuts = input.required<readonly PuiDocKeyboardShortcut[]>();
}

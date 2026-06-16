import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PuiCommandPaletteShortcutDirective } from '../../../premium-ui/command';
import { DOCS_COMMAND_PALETTE_SHORTCUTS } from '../commands/docs-commands';
import { DocsSidebarComponent } from '../shell/docs-sidebar.component';
import { DocsTocComponent } from '../shell/docs-toc.component';
import { DocsTopNavComponent } from '../shell/docs-top-nav.component';
import { PuiDocsCommandService } from '../services/docs-command.service';

@Component({
  selector: 'app-docs-layout',
  imports: [
    DocsSidebarComponent,
    DocsTocComponent,
    DocsTopNavComponent,
    RouterOutlet,
    PuiCommandPaletteShortcutDirective,
  ],
  providers: [PuiDocsCommandService],
  templateUrl: './docs-layout.component.html',
  styleUrl: './docs-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsLayoutComponent {
  protected readonly commandPaletteShortcuts = DOCS_COMMAND_PALETTE_SHORTCUTS;

  constructor() {
    inject(PuiDocsCommandService).register();
  }
}

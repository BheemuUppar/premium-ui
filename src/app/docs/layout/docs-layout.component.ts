import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DocsSidebarComponent } from '../shell/docs-sidebar.component';
import { DocsTocComponent } from '../shell/docs-toc.component';
import { DocsTopNavComponent } from '../shell/docs-top-nav.component';
import type { PuiDocsTocItem } from '../docs.types';

@Component({
  selector: 'app-docs-layout',
  imports: [DocsSidebarComponent, DocsTocComponent, DocsTopNavComponent, RouterOutlet],
  templateUrl: './docs-layout.component.html',
  styleUrl: './docs-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocsLayoutComponent {
  protected readonly tocItems: readonly PuiDocsTocItem[] = [
    { id: 'installation', label: 'Installation' },
    { id: 'basic-usage', label: 'Basic Usage' },
    { id: 'variants', label: 'Variants' },
    { id: 'sizes', label: 'Sizes' },
    { id: 'states', label: 'States' },
    { id: 'accessibility', label: 'Accessibility' },
    { id: 'api', label: 'API' },
    { id: 'playground', label: 'Playground' }
  ];
}

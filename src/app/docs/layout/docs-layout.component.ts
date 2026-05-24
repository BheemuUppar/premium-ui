import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DocsSidebarComponent } from '../shell/docs-sidebar.component';
import { DocsTocComponent } from '../shell/docs-toc.component';
import { DocsTopNavComponent } from '../shell/docs-top-nav.component';

@Component({
  selector: 'app-docs-layout',
  imports: [DocsSidebarComponent, DocsTocComponent, DocsTopNavComponent, RouterOutlet],
  templateUrl: './docs-layout.component.html',
  styleUrl: './docs-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsLayoutComponent {}

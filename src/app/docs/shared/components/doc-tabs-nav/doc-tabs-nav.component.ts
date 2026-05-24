import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import type { PuiDocsTab } from '../../../docs.types';

@Component({
  selector: 'pui-doc-tabs-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './doc-tabs-nav.component.html',
  styleUrl: './doc-tabs-nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PuiDocTabsNavComponent {
  readonly tabs = input.required<readonly PuiDocsTab[]>();
  readonly ariaLabel = input('Documentation sections');
}

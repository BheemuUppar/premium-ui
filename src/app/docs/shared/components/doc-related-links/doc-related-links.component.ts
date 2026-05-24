import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { PuiDocsRelatedLink } from '../../../seo/docs-seo.types';

@Component({
  selector: 'pui-doc-related-links',
  imports: [RouterLink],
  templateUrl: './doc-related-links.component.html',
  styleUrl: './doc-related-links.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PuiDocRelatedLinksComponent {
  readonly title = input('Related components');
  readonly links = input.required<readonly PuiDocsRelatedLink[]>();
}

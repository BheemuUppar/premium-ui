import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { PuiDocBreadcrumb } from '../../../docs.types';

@Component({
  selector: 'pui-doc-header',
  imports: [RouterLink],
  templateUrl: './doc-header.component.html',
  styleUrl: './doc-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PuiDocHeaderComponent {
  readonly title = input.required<string>();
  readonly description = input<string>('');
  readonly breadcrumbs = input<readonly PuiDocBreadcrumb[]>([
    { label: 'Home', route: ['/docs/components/button/overview'] },
    { label: 'Components', route: ['/docs/components/button/overview'] },
  ]);
}

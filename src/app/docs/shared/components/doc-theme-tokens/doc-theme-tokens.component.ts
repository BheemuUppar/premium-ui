import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { PuiDocThemeToken } from '../../../docs.types';
import { PuiDocCodeBlockComponent } from '../doc-code-block/doc-code-block.component';

@Component({
  selector: 'pui-doc-theme-tokens',
  imports: [PuiDocCodeBlockComponent],
  templateUrl: './doc-theme-tokens.component.html',
  styleUrl: './doc-theme-tokens.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PuiDocThemeTokensComponent {
  readonly tokens = input.required<readonly PuiDocThemeToken[]>();
  readonly scssExample = input('');
}

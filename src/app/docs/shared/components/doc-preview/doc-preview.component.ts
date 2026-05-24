import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'pui-doc-preview',
  templateUrl: './doc-preview.component.html',
  styleUrl: './doc-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'pui-doc-preview',
    '[class.pui-doc-preview--compact]': 'compact()',
    '[class.pui-doc-preview--flush]': 'flush()',
  },
})
export class PuiDocPreviewComponent {
  readonly label = input<string>('');
  readonly compact = input(false);
  readonly flush = input(false);
}

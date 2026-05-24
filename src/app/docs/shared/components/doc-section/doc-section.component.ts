import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'pui-doc-section',
  templateUrl: './doc-section.component.html',
  styleUrl: './doc-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'pui-doc-section',
    '[attr.id]': 'anchorId()',
  },
})
export class PuiDocSectionComponent {
  readonly anchorId = input.required<string>();
  readonly title = input<string>('');
  readonly description = input<string>('');
  readonly eyebrow = input<string>('');
}

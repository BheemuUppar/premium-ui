import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'pui-doc-playground',
  templateUrl: './doc-playground.component.html',
  styleUrl: './doc-playground.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PuiDocPlaygroundComponent {
  readonly title = input('Playground');
  readonly meta = input<string>('');
}

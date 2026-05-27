import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { PuiDocCodeBlockComponent } from '../doc-code-block/doc-code-block.component';

@Component({
  selector: 'pui-doc-installation',
  imports: [PuiDocCodeBlockComponent],
  templateUrl: './doc-installation.component.html',
  styleUrl: './doc-installation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PuiDocInstallationComponent {
  readonly importPath = input.required<string>();
  readonly importSymbols = input.required<string>();

  protected readonly importSnippet = computed(
    () => `import { ${this.importSymbols()} } from '${this.importPath()}';`
  );
}

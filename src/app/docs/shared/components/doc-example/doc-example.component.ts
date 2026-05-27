import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import type { PuiDocCodeTab } from '../../../docs.types';
import { combineExampleCode } from '../../utils/doc-example.utils';
import { PuiDocCodeBlockComponent } from '../doc-code-block/doc-code-block.component';

@Component({
  selector: 'pui-doc-example',
  imports: [PuiDocCodeBlockComponent],
  templateUrl: './doc-example.component.html',
  styleUrl: './doc-example.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PuiDocExampleComponent {
  readonly title = input.required<string>();
  readonly description = input('');
  readonly htmlCode = input('');
  readonly tsCode = input('');
  readonly scssCode = input('');
  readonly tabs = input<readonly PuiDocCodeTab[] | null>(null);
  readonly expandedByDefault = input(false);
  readonly compact = input(false);
  readonly allowFullCopy = input(false);
  readonly hideTs = input(false);
  readonly hideScss = input(false);
  readonly exampleId = input('');

  readonly codeExpandedChange = output<boolean>();

  protected readonly expanded = linkedSignal({
    source: this.expandedByDefault,
    computation: (value) => value,
  });

  protected readonly codePanelId = computed(() => {
    const id = this.exampleId().trim();
    if (id) {
      return id;
    }

    return `example-${this.title()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')}`;
  });

  protected readonly hasCode = computed(() => this.codeTabs().length > 0);

  protected readonly codeTabs = computed((): readonly PuiDocCodeTab[] => {
    const explicit = this.tabs();
    if (explicit?.length) {
      return explicit;
    }

    const tabs: PuiDocCodeTab[] = [];
    const html = this.htmlCode().trim();

    if (html) {
      tabs.push({ id: 'html', label: 'HTML', code: html, language: 'html' });
    }

    if (!this.hideTs()) {
      const ts = this.tsCode().trim();
      if (ts) {
        tabs.push({ id: 'ts', label: 'TypeScript', code: ts, language: 'typescript' });
      }
    }

    if (!this.hideScss()) {
      const scss = this.scssCode().trim();
      if (scss) {
        tabs.push({ id: 'scss', label: 'SCSS', code: scss, language: 'scss' });
      }
    }

    return tabs;
  });

  protected readonly fullExampleCode = computed(() => combineExampleCode(this.codeTabs()));

  protected toggleCode(): void {
    const next = !this.expanded();
    this.expanded.set(next);
    this.codeExpandedChange.emit(next);
  }
}

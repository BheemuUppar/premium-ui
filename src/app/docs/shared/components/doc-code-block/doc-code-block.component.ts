import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';
import type { PuiDocCodeTab } from '../../../docs.types';
import { countDocCodeLines, highlightDocCode } from '../../utils/doc-syntax.utils';

interface PuiDocCodePanel {
  readonly id: string;
  readonly label: string;
  readonly code: string;
  readonly language: string;
  readonly filename: string | null;
  readonly lineCount: number;
  readonly highlighted: SafeHtml;
}

const CODE_LINE_HEIGHT_PX = 22.4;
const CODE_BODY_PADDING_PX = 40;
const CODE_BODY_MIN_PX = 192;
const CODE_BODY_MAX_PX = 448;

@Component({
  selector: 'pui-doc-code-block',
  templateUrl: './doc-code-block.component.html',
  styleUrl: './doc-code-block.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PuiDocCodeBlockComponent {
  private readonly sanitizer = inject(DomSanitizer);

  readonly code = input<string>('');
  readonly language = input('html');
  readonly filename = input<string | null>(null);
  readonly tabs = input<readonly PuiDocCodeTab[]>([]);
  readonly fullCopyCode = input<string | null>(null);

  protected readonly activeTabId = signal<string | null>(null);
  protected readonly copied = signal(false);
  protected readonly copiedFull = signal(false);

  protected readonly hasTabs = computed(() => this.tabs().length > 0);

  protected readonly panels = computed((): readonly PuiDocCodePanel[] => {
    const tabs = this.tabs();

    if (tabs.length === 0) {
      const language = this.language();
      const code = this.code();

      return [
        {
          id: 'single',
          label: language,
          code,
          language,
          filename: this.filename(),
          lineCount: countDocCodeLines(code),
          highlighted: this.toHighlighted(code, language),
        },
      ];
    }

    return tabs.map((tab) => {
      const language = tab.language ?? this.language();

      return {
        id: tab.id,
        label: tab.label,
        code: tab.code,
        language,
        filename: tab.filename ?? null,
        lineCount: countDocCodeLines(tab.code),
        highlighted: this.toHighlighted(tab.code, language),
      };
    });
  });

  protected readonly bodyHeightPx = computed(() => {
    const maxLines = Math.max(...this.panels().map((panel) => panel.lineCount), 1);
    const estimated = maxLines * CODE_LINE_HEIGHT_PX + CODE_BODY_PADDING_PX;

    return Math.min(Math.max(estimated, CODE_BODY_MIN_PX), CODE_BODY_MAX_PX);
  });

  protected readonly activePanel = computed(() => {
    const panels = this.panels();
    const activeId = this.activeTabId() ?? panels[0]?.id;
    return panels.find((panel) => panel.id === activeId) ?? panels[0] ?? null;
  });

  protected selectTab(id: string): void {
    if (this.activeTabId() === id) {
      return;
    }

    this.activeTabId.set(id);
  }

  protected isActivePanel(id: string): boolean {
    const panels = this.panels();
    return (this.activeTabId() ?? panels[0]?.id) === id;
  }

  protected async copyCode(): Promise<void> {
    const panel = this.activePanel();
    const code = panel?.code;

    if (!code) {
      return;
    }

    await this.copyText(code, 'tab');
  }

  protected async copyFullExample(): Promise<void> {
    const code = this.fullCopyCode()?.trim();
    if (!code) {
      return;
    }

    await this.copyText(code, 'full');
  }

  private async copyText(code: string, target: 'tab' | 'full'): Promise<void> {
    try {
      await navigator.clipboard.writeText(code);
      if (target === 'full') {
        this.copiedFull.set(true);
        window.setTimeout(() => this.copiedFull.set(false), 1600);
        return;
      }

      this.copied.set(true);
      window.setTimeout(() => this.copied.set(false), 1600);
    } catch {
      this.copied.set(false);
      this.copiedFull.set(false);
    }
  }

  private toHighlighted(code: string, language: string): SafeHtml {
    if (!code) {
      return this.sanitizer.bypassSecurityTrustHtml('');
    }

    return this.sanitizer.bypassSecurityTrustHtml(highlightDocCode(code, language));
  }
}

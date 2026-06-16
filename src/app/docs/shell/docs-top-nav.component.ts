import { afterNextRender, ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PuiCommandPaletteService } from '../../../premium-ui/command';
import { PuiSelectComponent } from '../../../premium-ui/components/select';
import type { PuiSelectOption, PuiSelectValue } from '../../../premium-ui/components/select';
import { PuiThemeService } from '../services/theme.service';
import { resolveDocsCommandShortcutLabel } from '../utils/docs-shortcut-label.utils';

@Component({
  selector: 'app-docs-top-nav',
  imports: [RouterLink, RouterLinkActive, PuiSelectComponent],
  templateUrl: './docs-top-nav.component.html',
  styleUrl: './docs-top-nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocsTopNavComponent {
  protected readonly themeService = inject(PuiThemeService);
  private readonly palette = inject(PuiCommandPaletteService);

  protected readonly shortcutLabel = signal('Ctrl K');

  protected readonly versionOptions: readonly PuiSelectOption[] = [
    { label: 'v0.1.0', value: 'v0.1.0' },
    { label: 'next', value: 'next' },
  ];

  protected readonly selectedVersion = signal<PuiSelectValue>('v0.1.0');

  constructor() {
    afterNextRender(() => {
      this.shortcutLabel.set(resolveDocsCommandShortcutLabel());
    });
  }

  protected openCommandPalette(): void {
    this.palette.open({ animation: 'macos', positionAtCursor: true });
  }

  protected setVersion(value: PuiSelectValue | null): void {
    if (typeof value === 'string') {
      this.selectedVersion.set(value);
    }
  }
}

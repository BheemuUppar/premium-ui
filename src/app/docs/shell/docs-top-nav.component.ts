import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PuiSelectComponent } from '../../../premium-ui/components/select';
import type { PuiSelectOption, PuiSelectValue } from '../../../premium-ui/components/select';
import { PuiThemeService } from '../services/theme.service';

@Component({
  selector: 'app-docs-top-nav',
  imports: [RouterLink, RouterLinkActive, PuiSelectComponent],
  templateUrl: './docs-top-nav.component.html',
  styleUrl: './docs-top-nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocsTopNavComponent {
  protected readonly themeService = inject(PuiThemeService);
  protected readonly searchTerm = signal('');

  protected readonly versionOptions: readonly PuiSelectOption[] = [
    { label: 'v0.1.0', value: 'v0.1.0' },
    { label: 'next', value: 'next' },
  ];

  protected readonly selectedVersion = signal<PuiSelectValue>('v0.1.0');

  protected onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  protected setVersion(value: PuiSelectValue | null): void {
    if (typeof value === 'string') {
      this.selectedVersion.set(value);
    }
  }
}

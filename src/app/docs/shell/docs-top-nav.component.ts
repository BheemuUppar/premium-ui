import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PuiSelectComponent } from '../../../premium-ui/components/select';
import type { PuiSelectOption, PuiSelectValue } from '../../../premium-ui/components/select';
import { PuiDocsSearchService } from '../services/docs-search.service';
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
  private readonly searchService = inject(PuiDocsSearchService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly searchTerm = this.searchService.query;

  protected readonly versionOptions: readonly PuiSelectOption[] = [
    { label: 'v0.1.0', value: 'v0.1.0' },
    { label: 'next', value: 'next' },
  ];

  protected readonly selectedVersion = signal<PuiSelectValue>('v0.1.0');

  protected onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchService.setQuery(input.value);
  }

  constructor() {
    this.destroyRef.onDestroy(() => this.searchService.clear());
  }

  protected setVersion(value: PuiSelectValue | null): void {
    if (typeof value === 'string') {
      this.selectedVersion.set(value);
    }
  }
}

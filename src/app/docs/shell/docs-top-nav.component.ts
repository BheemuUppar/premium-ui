import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PuiThemeService } from '../services/theme.service';

@Component({
  selector: 'app-docs-top-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './docs-top-nav.component.html',
  styleUrl: './docs-top-nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocsTopNavComponent {
  protected readonly themeService = inject(PuiThemeService);
  protected readonly searchTerm = signal('');

  protected onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }
}

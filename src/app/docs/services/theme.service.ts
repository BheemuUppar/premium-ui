import { Injectable, signal } from '@angular/core';

export type PuiDocsTheme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class PuiThemeService {
  readonly theme = signal<PuiDocsTheme>('light');

  toggleTheme(): void {
    this.theme.update((theme) => (theme === 'light' ? 'dark' : 'light'));
  }
}

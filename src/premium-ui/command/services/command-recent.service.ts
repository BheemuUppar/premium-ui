import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';

const STORAGE_KEY = 'pui-command-recent';
const DEFAULT_LIMIT = 8;

@Injectable({ providedIn: 'root' })
export class PuiCommandRecentService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly recentIds = signal<readonly string[]>(this.readFromStorage());

  readonly ids = this.recentIds.asReadonly();

  record(id: string, limit = DEFAULT_LIMIT): void {
    this.recentIds.update((current) => {
      const next = [id, ...current.filter((entry) => entry !== id)].slice(0, limit);
      this.writeToStorage(next);
      return next;
    });
  }

  clear(): void {
    this.recentIds.set([]);
    this.writeToStorage([]);
  }

  private readFromStorage(): readonly string[] {
    if (!isPlatformBrowser(this.platformId)) {
      return [];
    }

    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return [];
      }

      const parsed = JSON.parse(raw) as unknown;
      return Array.isArray(parsed) ? parsed.filter((entry) => typeof entry === 'string') : [];
    } catch {
      return [];
    }
  }

  private writeToStorage(ids: readonly string[]): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      // Storage quota or privacy mode — ignore.
    }
  }
}

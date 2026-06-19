import { Injectable, signal } from '@angular/core';

export interface PuiChartRegistryEntry {
  readonly id: string;
  readonly label: string;
}

/** Registry for dynamic chart dashboards — future heatmap, treemap, etc. */
@Injectable({ providedIn: 'root' })
export class PuiChartRegistryService {
  private readonly entries = signal<readonly PuiChartRegistryEntry[]>([]);

  readonly charts = this.entries.asReadonly();

  register(entry: PuiChartRegistryEntry): void {
    this.entries.update((current) => {
      const without = current.filter((item) => item.id !== entry.id);
      return [...without, entry];
    });
  }

  unregister(id: string): void {
    this.entries.update((current) => current.filter((item) => item.id !== id));
  }
}

import { Injectable, signal } from '@angular/core';
import type { PuiDocsTocItem } from '../docs.types';

@Injectable({ providedIn: 'root' })
export class PuiDocsTocService {
  private readonly itemsSignal = signal<readonly PuiDocsTocItem[]>([]);
  private readonly revisionSignal = signal(0);

  readonly items = this.itemsSignal.asReadonly();
  readonly revision = this.revisionSignal.asReadonly();

  setItems(items: readonly PuiDocsTocItem[]): void {
    this.itemsSignal.set(items);
    this.revisionSignal.update((value) => value + 1);
  }

  clear(): void {
    this.setItems([]);
  }
}

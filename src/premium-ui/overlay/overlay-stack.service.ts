import { Injectable, signal } from '@angular/core';
import type { PuiOverlayRef } from './overlay-ref';

const BASE_Z_INDEX = 1300;
const Z_INDEX_STEP = 20;

@Injectable({ providedIn: 'root' })
export class PuiOverlayStackService {
  private readonly stack = signal(0);
  private readonly refs: PuiOverlayRef[] = [];

  readonly depth = this.stack.asReadonly();

  push(ref: PuiOverlayRef): number {
    this.refs.push(ref);
    const next = this.stack() + 1;
    this.stack.set(next);
    return BASE_Z_INDEX + next * Z_INDEX_STEP;
  }

  pop(ref: PuiOverlayRef): void {
    const index = this.refs.indexOf(ref);
    if (index >= 0) {
      this.refs.splice(index, 1);
    }

    this.stack.update((value) => Math.max(0, value - 1));
  }

  isTopMost(ref: PuiOverlayRef): boolean {
    return this.refs[this.refs.length - 1] === ref;
  }
}

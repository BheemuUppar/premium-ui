import { Injectable, inject } from '@angular/core';
import { mapIndicesToItems } from './dataset.utils';
import { PuiWorkerManager } from './worker-manager.service';
import type {
  PuiWorkerDatasetItem,
  PuiWorkerFilterCondition,
  PuiWorkerSearchMode,
  PuiWorkerSortConfig,
} from './worker.types';

export interface PuiDataSearchParams {
  readonly useWorker: boolean;
  readonly datasetId: string;
  readonly items: readonly PuiWorkerDatasetItem[];
  readonly query: string;
  readonly mode?: PuiWorkerSearchMode;
  readonly debounceMs?: number;
}

export interface PuiDataFilterParams {
  readonly useWorker: boolean;
  readonly datasetId: string;
  readonly items: readonly PuiWorkerDatasetItem[];
  readonly conditions: readonly PuiWorkerFilterCondition[];
}

export interface PuiDataSortParams {
  readonly useWorker: boolean;
  readonly datasetId: string;
  readonly items: readonly PuiWorkerDatasetItem[];
  readonly config: PuiWorkerSortConfig;
  readonly sourceIndices?: readonly number[];
}

/** High-level data processor with worker delegation, debounce, and cancellation. */
@Injectable({ providedIn: 'root' })
export class PuiDataProcessorService {
  private readonly workerManager = inject(PuiWorkerManager);
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private activeSearchToken = 0;

  cancelPending(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    this.activeSearchToken += 1;
    this.workerManager.cancelLatest();
  }

  async searchIndices(params: PuiDataSearchParams): Promise<readonly number[]> {
    const debounceMs = params.debounceMs ?? 0;

    if (debounceMs <= 0) {
      return this.executeSearch(params);
    }

    this.cancelPending();
    const token = ++this.activeSearchToken;

    return new Promise<readonly number[]>((resolve) => {
      this.debounceTimer = setTimeout(() => {
        if (token !== this.activeSearchToken) {
          resolve([]);
          return;
        }

        void this.executeSearch(params).then(resolve);
      }, debounceMs);
    });
  }

  async filterIndices(params: PuiDataFilterParams): Promise<readonly number[]> {
    await this.workerManager.ensureDataset(params.datasetId, params.items, params.useWorker);

    const response = await this.workerManager.dispatch(
      {
        type: 'filter',
        payload: {
          datasetId: params.datasetId,
          conditions: params.conditions,
        },
      },
      params.useWorker
    );

    if ('indices' in response) {
      return response.indices;
    }

    return params.items.map((_, index) => index);
  }

  async sortIndices(params: PuiDataSortParams): Promise<readonly number[]> {
    await this.workerManager.ensureDataset(params.datasetId, params.items, params.useWorker);

    const response = await this.workerManager.dispatch(
      {
        type: 'sort',
        payload: {
          datasetId: params.datasetId,
          config: params.config,
          sourceIndices: params.sourceIndices,
        },
      },
      params.useWorker
    );

    if ('indices' in response) {
      return response.indices;
    }

    return params.sourceIndices ?? params.items.map((_, index) => index);
  }

  mapIndices<T>(items: readonly T[], indices: readonly number[]): T[] {
    return mapIndicesToItems(items, indices);
  }

  private async executeSearch(params: PuiDataSearchParams): Promise<readonly number[]> {
    const query = params.query.trim();
    const allIndices = params.items.map((_, index) => index);

    if (!query) {
      return allIndices;
    }

    await this.workerManager.ensureDataset(params.datasetId, params.items, params.useWorker);

    const mode = params.mode ?? 'text';
    const type = mode === 'fuzzy' ? 'fuzzy-search' : 'search';

    const response = await this.workerManager.dispatch(
      {
        type,
        payload: {
          datasetId: params.datasetId,
          query,
          mode,
        },
      },
      params.useWorker
    );

    if ('indices' in response) {
      if (response.cancelled) {
        return [];
      }
      return response.indices;
    }

    return allIndices;
  }
}

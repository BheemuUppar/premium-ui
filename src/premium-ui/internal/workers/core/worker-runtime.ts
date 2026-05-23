import { filterIndices } from '../filter/filter.utils';
import { groupIndices } from '../grouping/group.utils';
import { buildSearchIndex, type PuiSearchIndex } from '../indexing/index.utils';
import { rankIndices } from '../ranking/rank.utils';
import { fuzzySearchIndices } from '../search/fuzzy-search.utils';
import { keywordSearchIndices, textSearchIndices } from '../search/search.utils';
import { sortIndices } from '../sort/sort.utils';
import { applyTransformSteps, normalizeDatasetItems } from '../transforms/transform.utils';
import type {
  PuiWorkerDatasetItem,
  PuiWorkerFilterPayload,
  PuiWorkerGroupPayload,
  PuiWorkerInitPayload,
  PuiWorkerRankPayload,
  PuiWorkerRequest,
  PuiWorkerResponse,
  PuiWorkerSearchPayload,
  PuiWorkerSortPayload,
  PuiWorkerTransformPayload,
} from './worker.types';

interface PuiWorkerDatasetState {
  readonly items: readonly PuiWorkerDatasetItem[];
  readonly fingerprint: string;
  readonly searchIndex: PuiSearchIndex;
}

/** Shared operation runtime used by worker thread and main-thread fallback. */
export class PuiWorkerRuntime {
  private readonly datasets = new Map<string, PuiWorkerDatasetState>();
  private readonly cancelledRequests = new Set<number>();

  cancelRequest(requestId: number): void {
    this.cancelledRequests.add(requestId);
  }

  clearCancellation(requestId: number): void {
    this.cancelledRequests.delete(requestId);
  }

  handle(request: PuiWorkerRequest): PuiWorkerResponse {
    if (request.type === 'cancel') {
      const payload = request.payload as { requestId: number };
      this.cancelRequest(payload.requestId);
      return {
        requestId: payload.requestId,
        datasetId: '',
        indices: [],
        cancelled: true,
      };
    }

    try {
      switch (request.type) {
        case 'init-dataset':
          return this.handleInit(request.requestId, request.payload as PuiWorkerInitPayload);
        case 'search':
        case 'fuzzy-search':
          return this.handleSearch(request.requestId, request.payload as PuiWorkerSearchPayload, request.type);
        case 'filter':
          return this.handleFilter(request.requestId, request.payload as PuiWorkerFilterPayload);
        case 'sort':
          return this.handleSort(request.requestId, request.payload as PuiWorkerSortPayload);
        case 'group':
          return this.handleGroup(request.requestId, request.payload as PuiWorkerGroupPayload);
        case 'rank':
          return this.handleRank(request.requestId, request.payload as PuiWorkerRankPayload);
        case 'transform':
          return this.handleTransform(request.requestId, request.payload as PuiWorkerTransformPayload);
        default:
          return { requestId: request.requestId, error: `Unsupported operation: ${request.type}` };
      }
    } catch (error) {
      return {
        requestId: request.requestId,
        error: error instanceof Error ? error.message : 'Worker operation failed',
      };
    }
  }

  hasDataset(datasetId: string, fingerprint: string): boolean {
    const state = this.datasets.get(datasetId);
    return state?.fingerprint === fingerprint;
  }

  private handleInit(requestId: number, payload: PuiWorkerInitPayload): PuiWorkerResponse {
    const items = normalizeDatasetItems(payload.items);
    this.datasets.set(payload.datasetId, {
      items,
      fingerprint: payload.fingerprint,
      searchIndex: buildSearchIndex(items),
    });

    return {
      requestId,
      datasetId: payload.datasetId,
      itemCount: items.length,
    };
  }

  private handleSearch(
    requestId: number,
    payload: PuiWorkerSearchPayload,
    type: 'search' | 'fuzzy-search'
  ): PuiWorkerResponse {
    if (this.isCancelled(requestId)) {
      return this.cancelledResponse(requestId, payload.datasetId);
    }

    const items = this.getItems(payload.datasetId);
    const mode = type === 'fuzzy-search' ? 'fuzzy' : payload.mode;

    let indices: number[];

    if (mode === 'fuzzy') {
      indices = fuzzySearchIndices(items, payload.query, payload.sourceIndices);
    } else if (mode === 'keyword') {
      indices = keywordSearchIndices(items, payload.query, payload.sourceIndices);
    } else {
      indices = textSearchIndices(items, payload.query, payload.sourceIndices);
    }

    return { requestId, datasetId: payload.datasetId, indices };
  }

  private handleFilter(requestId: number, payload: PuiWorkerFilterPayload): PuiWorkerResponse {
    if (this.isCancelled(requestId)) {
      return this.cancelledResponse(requestId, payload.datasetId);
    }

    const items = this.getItems(payload.datasetId);
    const indices = filterIndices(items, payload.conditions, payload.sourceIndices);
    return { requestId, datasetId: payload.datasetId, indices };
  }

  private handleSort(requestId: number, payload: PuiWorkerSortPayload): PuiWorkerResponse {
    if (this.isCancelled(requestId)) {
      return this.cancelledResponse(requestId, payload.datasetId);
    }

    const items = this.getItems(payload.datasetId);
    const indices = sortIndices(items, payload.config, payload.sourceIndices);
    return { requestId, datasetId: payload.datasetId, indices };
  }

  private handleGroup(requestId: number, payload: PuiWorkerGroupPayload): PuiWorkerResponse {
    if (this.isCancelled(requestId)) {
      return { requestId, datasetId: payload.datasetId, groups: {} };
    }

    const items = this.getItems(payload.datasetId);
    const groups = groupIndices(items, payload.config, payload.sourceIndices);
    return { requestId, datasetId: payload.datasetId, groups };
  }

  private handleRank(requestId: number, payload: PuiWorkerRankPayload): PuiWorkerResponse {
    if (this.isCancelled(requestId)) {
      return this.cancelledResponse(requestId, payload.datasetId);
    }

    const items = this.getItems(payload.datasetId);
    const indices = rankIndices(items, payload.config.query, payload.config.mode, payload.sourceIndices);
    return { requestId, datasetId: payload.datasetId, indices };
  }

  private handleTransform(requestId: number, payload: PuiWorkerTransformPayload): PuiWorkerResponse {
    if (this.isCancelled(requestId)) {
      return this.cancelledResponse(requestId, payload.datasetId);
    }

    const items = this.getItems(payload.datasetId);
    const indices = applyTransformSteps(items, payload.steps, payload.sourceIndices);
    return { requestId, datasetId: payload.datasetId, indices };
  }

  private getItems(datasetId: string): readonly PuiWorkerDatasetItem[] {
    const state = this.datasets.get(datasetId);
    if (!state) {
      throw new Error(`Dataset "${datasetId}" is not initialized`);
    }
    return state.items;
  }

  private isCancelled(requestId: number): boolean {
    return this.cancelledRequests.has(requestId);
  }

  private cancelledResponse(requestId: number, datasetId: string): PuiWorkerResponse {
    this.clearCancellation(requestId);
    return { requestId, datasetId, indices: [], cancelled: true };
  }
}

export function processOnMainThread(request: PuiWorkerRequest): PuiWorkerResponse {
  const runtime = getSharedMainThreadRuntime();
  return runtime.handle(request);
}

let sharedRuntime: PuiWorkerRuntime | null = null;

function getSharedMainThreadRuntime(): PuiWorkerRuntime {
  sharedRuntime ??= new PuiWorkerRuntime();
  return sharedRuntime;
}

/** Compact dataset row optimized for worker transfer and indexing. */
export interface PuiWorkerDatasetItem {
  readonly label: string;
  readonly searchText: string;
  readonly disabled?: boolean;
  readonly groupKey?: string;
  readonly rankWeight?: number;
}

export type PuiWorkerSearchMode = 'text' | 'fuzzy' | 'keyword';

export type PuiWorkerSortDirection = 'asc' | 'desc';

export type PuiWorkerOperationType =
  | 'init-dataset'
  | 'search'
  | 'filter'
  | 'fuzzy-search'
  | 'sort'
  | 'group'
  | 'rank'
  | 'transform'
  | 'cancel';

export interface PuiWorkerFilterCondition {
  readonly field: 'label' | 'searchText' | 'groupKey';
  readonly operator: 'equals' | 'contains' | 'startsWith';
  readonly value: string;
}

export interface PuiWorkerSortConfig {
  readonly field: 'label' | 'searchText' | 'rankWeight';
  readonly direction: PuiWorkerSortDirection;
  readonly locale?: string;
}

export interface PuiWorkerGroupConfig {
  readonly field: 'groupKey' | 'label';
}

export interface PuiWorkerRankConfig {
  readonly query: string;
  readonly mode: PuiWorkerSearchMode;
}

export interface PuiWorkerTransformStep {
  readonly type: 'map-label' | 'normalize' | 'flatten-groups';
}

export interface PuiWorkerInitPayload {
  readonly datasetId: string;
  readonly items: readonly PuiWorkerDatasetItem[];
  readonly fingerprint: string;
}

export interface PuiWorkerSearchPayload {
  readonly datasetId: string;
  readonly query: string;
  readonly mode: PuiWorkerSearchMode;
  readonly sourceIndices?: readonly number[];
}

export interface PuiWorkerFilterPayload {
  readonly datasetId: string;
  readonly conditions: readonly PuiWorkerFilterCondition[];
  readonly sourceIndices?: readonly number[];
}

export interface PuiWorkerSortPayload {
  readonly datasetId: string;
  readonly config: PuiWorkerSortConfig;
  readonly sourceIndices?: readonly number[];
}

export interface PuiWorkerGroupPayload {
  readonly datasetId: string;
  readonly config: PuiWorkerGroupConfig;
  readonly sourceIndices?: readonly number[];
}

export interface PuiWorkerRankPayload {
  readonly datasetId: string;
  readonly config: PuiWorkerRankConfig;
  readonly sourceIndices?: readonly number[];
}

export interface PuiWorkerTransformPayload {
  readonly datasetId: string;
  readonly steps: readonly PuiWorkerTransformStep[];
  readonly sourceIndices?: readonly number[];
}

export interface PuiWorkerCancelPayload {
  readonly requestId: number;
}

export type PuiWorkerRequestPayload =
  | PuiWorkerInitPayload
  | PuiWorkerSearchPayload
  | PuiWorkerFilterPayload
  | PuiWorkerSortPayload
  | PuiWorkerGroupPayload
  | PuiWorkerRankPayload
  | PuiWorkerTransformPayload
  | PuiWorkerCancelPayload;

export interface PuiWorkerRequest<T extends PuiWorkerOperationType = PuiWorkerOperationType> {
  readonly requestId: number;
  readonly type: T;
  readonly payload: PuiWorkerRequestPayload;
}

export interface PuiWorkerIndicesResponse {
  readonly requestId: number;
  readonly datasetId: string;
  readonly indices: readonly number[];
  readonly cancelled?: boolean;
}

export interface PuiWorkerInitResponse {
  readonly requestId: number;
  readonly datasetId: string;
  readonly itemCount: number;
}

export interface PuiWorkerGroupResponse {
  readonly requestId: number;
  readonly datasetId: string;
  readonly groups: Readonly<Record<string, readonly number[]>>;
}

export interface PuiWorkerErrorResponse {
  readonly requestId: number;
  readonly error: string;
}

export type PuiWorkerResponse =
  | PuiWorkerIndicesResponse
  | PuiWorkerInitResponse
  | PuiWorkerGroupResponse
  | PuiWorkerErrorResponse;

export interface PuiWorkerProcessOptions {
  readonly useWorker: boolean;
  readonly debounceMs?: number;
}

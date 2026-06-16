/**
 * Future dedicated worker entry for command indexing and search.
 * Architecture placeholder — palette uses {@link PuiWorkerManager} today.
 *
 * When [useWorker]="true" on large datasets, search delegates to the shared
 * Premium UI data worker via rank/search operations.
 */
export const PUI_COMMAND_WORKER_MODULE = './command-worker.ts';

export interface PuiCommandWorkerInitMessage {
  readonly type: 'init';
  readonly commands: readonly {
    readonly id: string;
    readonly label: string;
    readonly searchText: string;
    readonly groupKey?: string;
  }[];
}

export interface PuiCommandWorkerSearchMessage {
  readonly type: 'search';
  readonly requestId: number;
  readonly query: string;
  readonly fuzzy: boolean;
}

export type PuiCommandWorkerMessage = PuiCommandWorkerInitMessage | PuiCommandWorkerSearchMessage;

export interface PuiCommandWorkerSearchResult {
  readonly type: 'search-result';
  readonly requestId: number;
  readonly ids: readonly string[];
}

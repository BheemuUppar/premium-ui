import { Injectable, OnDestroy } from '@angular/core';
import { PuiWorkerRuntime } from './worker-runtime';
import type {
  PuiWorkerDatasetItem,
  PuiWorkerRequest,
  PuiWorkerResponse,
} from './worker.types';
import { computeDatasetFingerprint } from './dataset.utils';

interface PendingRequest {
  readonly resolve: (response: PuiWorkerResponse) => void;
  readonly reject: (error: Error) => void;
}

/**
 * Manages Premium UI worker lifecycle, routing, cancellation, and fallback.
 * Workers are opt-in — callers pass useWorker to delegate heavy computation.
 */
@Injectable({ providedIn: 'root' })
export class PuiWorkerManager implements OnDestroy {
  private worker: Worker | null = null;
  private workerSupported = false;
  private workerInitialized = false;
  private requestCounter = 0;
  private latestRequestId = 0;

  private readonly fallbackRuntime = new PuiWorkerRuntime();
  private readonly pending = new Map<number, PendingRequest>();
  private readonly datasetFingerprints = new Map<string, string>();

  ngOnDestroy(): void {
    this.terminateWorker();
  }

  isWorkerSupported(): boolean {
    return this.workerSupported;
  }

  async ensureDataset(
    datasetId: string,
    items: readonly PuiWorkerDatasetItem[],
    useWorker: boolean
  ): Promise<void> {
    const fingerprint = computeDatasetFingerprint(items);

    if (this.datasetFingerprints.get(datasetId) === fingerprint) {
      return;
    }

    await this.dispatch(
      {
        type: 'init-dataset',
        payload: { datasetId, items, fingerprint },
      },
      useWorker
    );

    this.datasetFingerprints.set(datasetId, fingerprint);
  }

  async dispatch(
    request: Omit<PuiWorkerRequest, 'requestId'>,
    useWorker: boolean
  ): Promise<PuiWorkerResponse> {
    const requestId = ++this.requestCounter;
    this.latestRequestId = requestId;
    const fullRequest: PuiWorkerRequest = { ...request, requestId };

    if (useWorker && this.tryInitializeWorker()) {
      return this.dispatchToWorker(fullRequest);
    }

    return Promise.resolve(this.fallbackRuntime.handle(fullRequest));
  }

  cancelLatest(): void {
    if (this.latestRequestId > 0) {
      this.cancel(this.latestRequestId);
    }
  }

  cancel(requestId: number): void {
    this.fallbackRuntime.cancelRequest(requestId);

    if (this.worker && this.workerSupported) {
      const cancelRequest: PuiWorkerRequest = {
        requestId,
        type: 'cancel',
        payload: { requestId },
      };
      this.worker.postMessage(cancelRequest);
    }

    const pending = this.pending.get(requestId);
    if (pending) {
      pending.resolve({
        requestId,
        datasetId: '',
        indices: [],
        cancelled: true,
      });
      this.pending.delete(requestId);
    }
  }

  private tryInitializeWorker(): boolean {
    if (this.workerInitialized) {
      return this.workerSupported;
    }

    this.workerInitialized = true;

    if (typeof Worker === 'undefined') {
      this.workerSupported = false;
      return false;
    }

    try {
      this.worker = new Worker(new URL('./data.worker', import.meta.url), { type: 'module' });
      this.worker.addEventListener('message', (event: MessageEvent<PuiWorkerResponse>) => {
        this.handleWorkerMessage(event.data);
      });
      this.worker.addEventListener('error', () => {
        this.workerSupported = false;
        this.rejectAllPending(new Error('Worker crashed'));
        this.terminateWorker();
      });
      this.workerSupported = true;
      return true;
    } catch {
      this.workerSupported = false;
      this.worker = null;
      return false;
    }
  }

  private dispatchToWorker(request: PuiWorkerRequest): Promise<PuiWorkerResponse> {
    if (!this.worker) {
      return Promise.resolve(this.fallbackRuntime.handle(request));
    }

    return new Promise<PuiWorkerResponse>((resolve, reject) => {
      this.pending.set(request.requestId, { resolve, reject });
      this.worker!.postMessage(request);
    });
  }

  private handleWorkerMessage(response: PuiWorkerResponse): void {
    const pending = this.pending.get(response.requestId);
    if (!pending) {
      return;
    }

    this.pending.delete(response.requestId);

    if ('error' in response) {
      pending.reject(new Error(response.error));
      return;
    }

    pending.resolve(response);
  }

  private rejectAllPending(error: Error): void {
    for (const [requestId, pending] of this.pending.entries()) {
      pending.reject(error);
      this.pending.delete(requestId);
    }
  }

  private terminateWorker(): void {
    this.worker?.terminate();
    this.worker = null;
    this.workerSupported = false;
    this.workerInitialized = false;
    this.rejectAllPending(new Error('Worker terminated'));
  }
}

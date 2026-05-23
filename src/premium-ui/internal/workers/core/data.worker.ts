/// <reference lib="webworker" />

import { PuiWorkerRuntime } from './worker-runtime';
import type { PuiWorkerRequest } from './worker.types';

const runtime = new PuiWorkerRuntime();

addEventListener('message', (event: MessageEvent<PuiWorkerRequest>) => {
  const response = runtime.handle(event.data);
  postMessage(response);
});

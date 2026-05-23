import type { PuiWorkerTransformStep } from '../core/worker.types';
import { applyTransformSteps, runTransformPipeline } from './transform.utils';

export function executeTransformPipeline(
  items: readonly { readonly label: string; readonly searchText: string }[],
  steps: readonly PuiWorkerTransformStep[],
  sourceIndices?: readonly number[]
): number[] {
  const normalized = runTransformPipeline(items, steps);
  return applyTransformSteps(normalized, steps, sourceIndices);
}

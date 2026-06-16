import { rankIndices } from '../../internal/workers/ranking/rank.utils';
import { keywordSearchIndices, textSearchIndices } from '../../internal/workers/search/search.utils';
import type { PuiWorkerSearchMode } from '../../internal/workers/core/worker.types';
import type { PuiCommand, PuiCommandSearchOptions } from '../registry/command.types';
import { commandToSearchItem } from '../utils/command-search-text.utils';

const COMMAND_DATASET_ID = 'pui-command-registry';

export interface PuiCommandSearchIndexEntry {
  readonly command: PuiCommand;
  readonly searchText: string;
  readonly label: string;
}

/** Builds a searchable index from command definitions. */
export function buildCommandSearchIndex(
  commands: readonly PuiCommand[],
  options?: Pick<PuiCommandSearchOptions, 'includeHidden' | 'includeDisabled'>
): readonly PuiCommandSearchIndexEntry[] {
  return commands
    .filter((command) => {
      if (!options?.includeHidden && command.hidden) {
        return false;
      }
      if (!options?.includeDisabled && command.disabled) {
        return false;
      }
      return true;
    })
    .map((command) => ({
      command,
      label: command.label,
      searchText: commandToSearchItem(command).searchText,
    }));
}

/**
 * Main-thread command search — worker-ready via shared ranking utilities.
 * Large registries can delegate to {@link PuiCommandSearchService.searchAsync}.
 */
export function searchCommandIndex(
  index: readonly PuiCommandSearchIndexEntry[],
  query: string,
  options?: Pick<PuiCommandSearchOptions, 'maxResults' | 'fuzzy'>
): readonly PuiCommandSearchIndexEntry[] {
  const normalizedQuery = query.trim();
  const maxResults = options?.maxResults ?? 50;
  const fuzzy = options?.fuzzy ?? true;

  if (!normalizedQuery) {
    return index.slice(0, maxResults);
  }

  const workerItems = index.map((entry) => ({
    label: entry.label,
    searchText: entry.searchText,
  }));

  const mode: PuiWorkerSearchMode = fuzzy ? 'fuzzy' : 'keyword';
  let matchedIndices: number[];

  if (mode === 'fuzzy') {
    matchedIndices = rankIndices(workerItems, normalizedQuery, 'fuzzy');
  } else {
    matchedIndices = keywordSearchIndices(workerItems, normalizedQuery);
    if (matchedIndices.length === 0) {
      matchedIndices = textSearchIndices(workerItems, normalizedQuery);
    }
  }

  return matchedIndices.slice(0, maxResults).map((indexPosition) => index[indexPosition]!);
}

export { COMMAND_DATASET_ID };

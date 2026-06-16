import { Injectable, inject } from '@angular/core';
import { PuiWorkerManager } from '../../internal/workers/core/worker-manager.service';
import type { PuiCommand, PuiCommandSearchOptions } from '../registry/command.types';
import { PuiCommandRegistry } from '../registry/command-registry.service';
import {
  COMMAND_DATASET_ID,
  buildCommandSearchIndex,
  searchCommandIndex,
  type PuiCommandSearchIndexEntry,
} from './command-search.utils';
import { commandToSearchItem } from '../utils/command-search-text.utils';

export interface PuiCommandSearchResponse {
  readonly results: readonly PuiCommandSearchIndexEntry[];
  readonly query: string;
}

/**
 * Command search engine — decoupled from palette UI.
 * Uses shared worker infrastructure when `useWorker` is enabled.
 */
@Injectable({ providedIn: 'root' })
export class PuiCommandSearchService {
  private readonly registry = inject(PuiCommandRegistry);
  private readonly workerManager = inject(PuiWorkerManager);

  /** Synchronous search for instant palette feedback (default path). */
  search(options: PuiCommandSearchOptions = {}): PuiCommandSearchResponse {
    const query = options.query ?? '';
    const index = buildCommandSearchIndex(this.registry.getCommands(), options);
    const results = searchCommandIndex(index, query, options);

    return { results, query };
  }

  /** Async search with optional worker delegation for large command sets. */
  async searchAsync(options: PuiCommandSearchOptions = {}): Promise<PuiCommandSearchResponse> {
    const query = options.query ?? '';
    const commands = this.registry.getCommands();
    const index = buildCommandSearchIndex(commands, options);

    if (!options.useWorker || commands.length < 200) {
      return { results: searchCommandIndex(index, query, options), query };
    }

    const workerItems = commands
      .filter((command) => this.isVisible(command, options))
      .map((command) => commandToSearchItem(command));

    await this.workerManager.ensureDataset(COMMAND_DATASET_ID, workerItems, true);

    const mode = options.fuzzy === false ? 'keyword' : 'fuzzy';
    const response = await this.workerManager.dispatch(
      {
        type: 'rank',
        payload: {
          datasetId: COMMAND_DATASET_ID,
          config: { query, mode },
        },
      },
      true
    );

    if ('error' in response || !('indices' in response)) {
      return { results: searchCommandIndex(index, query, options), query };
    }

    const visibleCommands = commands.filter((command) => this.isVisible(command, options));
    const maxResults = options.maxResults ?? 50;
    const results = response.indices
      .slice(0, maxResults)
      .map((position) => {
        const command = visibleCommands[position];
        if (!command) {
          return null;
        }
        return {
          command,
          label: command.label,
          searchText: commandToSearchItem(command).searchText,
        };
      })
      .filter((entry): entry is PuiCommandSearchIndexEntry => entry !== null);

    return { results, query };
  }

  private isVisible(command: PuiCommand, options: PuiCommandSearchOptions): boolean {
    if (!options.includeHidden && command.hidden) {
      return false;
    }
    if (!options.includeDisabled && command.disabled) {
      return false;
    }
    return true;
  }
}

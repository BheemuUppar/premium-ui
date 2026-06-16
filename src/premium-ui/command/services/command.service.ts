import { Injectable, inject } from '@angular/core';
import type {
  PuiCommand,
  PuiCommandExecuteResult,
  PuiCommandGroup,
  PuiCommandSearchOptions,
} from '../registry/command.types';
import { PuiCommandRegistry } from '../registry/command-registry.service';
import { PuiCommandSearchService } from '../search/command-search.service';
import { groupCommandsWithRecent } from '../utils/command-group.utils';
import { PuiCommandRecentService } from './command-recent.service';

/**
 * Facade over registry, search, execution, and recents.
 * UI consumers should prefer this service over touching the registry directly.
 */
@Injectable({ providedIn: 'root' })
export class PuiCommandService {
  private readonly registry = inject(PuiCommandRegistry);
  private readonly searchService = inject(PuiCommandSearchService);
  private readonly recentService = inject(PuiCommandRecentService);

  register(command: PuiCommand): void {
    this.registry.register(command);
  }

  registerMany(commands: readonly PuiCommand[]): void {
    this.registry.registerMany(commands);
  }

  unregister(id: string): boolean {
    return this.registry.unregister(id);
  }

  clear(): void {
    this.registry.clear();
  }

  getCommands(): readonly PuiCommand[] {
    return this.registry.getCommands();
  }

  search(options: PuiCommandSearchOptions = {}) {
    return this.searchService.search(options);
  }

  searchAsync(options: PuiCommandSearchOptions = {}) {
    return this.searchService.searchAsync(options);
  }

  /** Returns grouped commands for palette rendering, optionally including recents. */
  resolveGroupedCommands(
    options: PuiCommandSearchOptions & { showRecent?: boolean; recentLimit?: number } = {}
  ): readonly PuiCommandGroup[] {
    const { results } = this.searchService.search(options);
    const commands = results.map((entry) => entry.command);

    if (!options.showRecent || (options.query ?? '').trim().length > 0) {
      return groupCommandsWithRecent(commands, []);
    }

    const recentCommands = this.recentService
      .ids()
      .slice(0, options.recentLimit ?? 5)
      .map((id) => this.registry.getCommand(id))
      .filter((command): command is PuiCommand => command !== undefined && !command.hidden);

    const recentIds = new Set(recentCommands.map((command) => command.id));
    const filtered = commands.filter((command) => !recentIds.has(command.id));

    return groupCommandsWithRecent(filtered, recentCommands);
  }

  async execute(id: string): Promise<PuiCommandExecuteResult> {
    const command = this.registry.getCommand(id);

    if (!command) {
      return 'missing';
    }

    if (command.disabled) {
      return 'disabled';
    }

    if (!command.action) {
      return 'missing';
    }

    try {
      await command.action();
      this.recentService.record(id);
      return 'success';
    } catch {
      return 'error';
    }
  }
}

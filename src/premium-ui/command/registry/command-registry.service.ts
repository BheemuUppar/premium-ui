import { Injectable, computed, signal } from '@angular/core';
import type { PuiCommand, PuiCommandSearchOptions } from './command.types';
import { buildCommandSearchIndex, searchCommandIndex } from '../search/command-search.utils';

/**
 * Central registry for Premium UI commands.
 * Modules register commands independently — never hardcode lists in UI components.
 */
@Injectable({ providedIn: 'root' })
export class PuiCommandRegistry {
  private readonly commandsSignal = signal<ReadonlyMap<string, PuiCommand>>(new Map());

  /** Reactive snapshot of all registered commands. */
  readonly commands = computed(() => [...this.commandsSignal().values()]);

  readonly count = computed(() => this.commandsSignal().size);

  register(command: PuiCommand): void {
    this.commandsSignal.update((current) => {
      const next = new Map(current);
      next.set(command.id, { ...command });
      return next;
    });
  }

  registerMany(commands: readonly PuiCommand[]): void {
    this.commandsSignal.update((current) => {
      const next = new Map(current);
      for (const command of commands) {
        next.set(command.id, { ...command });
      }
      return next;
    });
  }

  unregister(id: string): boolean {
    let removed = false;

    this.commandsSignal.update((current) => {
      if (!current.has(id)) {
        return current;
      }

      const next = new Map(current);
      next.delete(id);
      removed = true;
      return next;
    });

    return removed;
  }

  clear(): void {
    this.commandsSignal.set(new Map());
  }

  getCommand(id: string): PuiCommand | undefined {
    return this.commandsSignal().get(id);
  }

  getCommands(): readonly PuiCommand[] {
    return this.commands();
  }

  has(id: string): boolean {
    return this.commandsSignal().has(id);
  }

  /** Synchronous search over registered commands. */
  search(options: PuiCommandSearchOptions = {}): readonly PuiCommand[] {
    const index = buildCommandSearchIndex(this.getCommands(), options);
    return searchCommandIndex(index, options.query ?? '', options).map((entry) => entry.command);
  }
}

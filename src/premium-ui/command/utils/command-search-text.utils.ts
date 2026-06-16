import type { PuiCommand } from '../registry/command.types';

/** Builds normalized search text from command fields for indexing and matching. */
export function buildCommandSearchText(command: PuiCommand): string {
  const parts = [command.label, command.description, ...(command.keywords ?? []), command.group]
    .filter(Boolean)
    .map((part) => String(part).toLowerCase());

  return parts.join(' ');
}

/** Converts a command registry entry into a worker-compatible searchable item. */
export function commandToSearchItem(command: PuiCommand): {
  readonly label: string;
  readonly searchText: string;
  readonly disabled?: boolean;
  readonly groupKey?: string;
  readonly rankWeight?: number;
} {
  return {
    label: command.label,
    searchText: buildCommandSearchText(command),
    disabled: command.disabled,
    groupKey: command.group,
  };
}

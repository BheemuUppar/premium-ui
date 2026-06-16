import type { PuiCommand, PuiCommandGroup } from '../registry/command.types';

const RECENT_GROUP_ID = '__pui_recent__';
const RECENT_GROUP_LABEL = 'Recent';

export function groupCommands(commands: readonly PuiCommand[]): readonly PuiCommandGroup[] {
  const groups = new Map<string, PuiCommand[]>();

  for (const command of commands) {
    const key = command.group?.trim() || 'Commands';
    const bucket = groups.get(key);

    if (bucket) {
      bucket.push(command);
    } else {
      groups.set(key, [command]);
    }
  }

  return [...groups.entries()].map(([label, items]) => ({
    id: label.toLowerCase().replace(/\s+/g, '-'),
    label,
    commands: items,
  }));
}

export function groupCommandsWithRecent(
  commands: readonly PuiCommand[],
  recentCommands: readonly PuiCommand[]
): readonly PuiCommandGroup[] {
  const groups: PuiCommandGroup[] = [];

  if (recentCommands.length > 0) {
    groups.push({
      id: RECENT_GROUP_ID,
      label: RECENT_GROUP_LABEL,
      commands: recentCommands,
    });
  }

  return [...groups, ...groupCommands(commands)];
}

export function isRecentCommandGroup(groupId: string): boolean {
  return groupId === RECENT_GROUP_ID;
}

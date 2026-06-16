export type PuiCommandShortcutToken = 'meta' | 'ctrl' | 'alt' | 'shift';

export interface PuiCommandShortcutBinding {
  readonly meta?: boolean;
  readonly ctrl?: boolean;
  readonly alt?: boolean;
  readonly shift?: boolean;
  readonly key: string;
}

/** Parses strings like `meta+k`, `ctrl+shift+p` into a normalized binding. */
export function parseCommandShortcut(shortcut: string): PuiCommandShortcutBinding | null {
  const parts = shortcut
    .trim()
    .toLowerCase()
    .split('+')
    .filter(Boolean);

  if (parts.length === 0) {
    return null;
  }

  const key = parts.at(-1);
  if (!key) {
    return null;
  }

  const modifiers = parts.slice(0, -1);

  return {
    meta: modifiers.includes('meta') || modifiers.includes('cmd') || modifiers.includes('command'),
    ctrl: modifiers.includes('ctrl') || modifiers.includes('control'),
    alt: modifiers.includes('alt') || modifiers.includes('option'),
    shift: modifiers.includes('shift'),
    key,
  };
}

/** Returns true when a keyboard event matches a parsed shortcut binding. */
export function matchesCommandShortcut(
  event: KeyboardEvent,
  binding: PuiCommandShortcutBinding
): boolean {
  const eventKey = event.key.length === 1 ? event.key.toLowerCase() : event.key.toLowerCase();

  if (eventKey !== binding.key && event.code.toLowerCase() !== `key${binding.key}`) {
    return false;
  }

  const wantsMeta = binding.meta ?? false;
  const wantsCtrl = binding.ctrl ?? false;
  const wantsAlt = binding.alt ?? false;
  const wantsShift = binding.shift ?? false;

  return (
    event.metaKey === wantsMeta &&
    event.ctrlKey === wantsCtrl &&
    event.altKey === wantsAlt &&
    event.shiftKey === wantsShift
  );
}

/** Formats a shortcut binding for display (visual only). */
export function formatCommandShortcutDisplay(binding: PuiCommandShortcutBinding): string {
  const parts: string[] = [];

  if (binding.meta) {
    parts.push('⌘');
  }
  if (binding.ctrl) {
    parts.push('Ctrl');
  }
  if (binding.alt) {
    parts.push('⌥');
  }
  if (binding.shift) {
    parts.push('⇧');
  }

  parts.push(binding.key.length === 1 ? binding.key.toUpperCase() : binding.key);

  return parts.join('');
}

/** Human-readable command palette shortcut for docs chrome (Mac vs Windows). */
export function resolveDocsCommandShortcutLabel(): string {
  if (typeof navigator === 'undefined') {
    return 'Ctrl K';
  }

  return /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? '⌘K' : 'Ctrl K';
}

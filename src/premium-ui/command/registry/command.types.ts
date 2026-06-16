/** Scalable command definition — decoupled from any UI consumer. */
export interface PuiCommand {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
  readonly icon?: string;
  readonly group?: string;
  readonly keywords?: readonly string[];
  /** Display-only shortcut label (e.g. "⌘K"). Binding is separate. */
  readonly shortcut?: string;
  readonly disabled?: boolean;
  readonly hidden?: boolean;
  readonly action?: () => void | Promise<void>;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface PuiCommandGroup {
  readonly id: string;
  readonly label: string;
  readonly commands: readonly PuiCommand[];
}

export interface PuiCommandSearchResult {
  readonly command: PuiCommand;
  readonly score: number;
}

export interface PuiCommandSearchOptions {
  readonly query?: string;
  readonly maxResults?: number;
  readonly includeHidden?: boolean;
  readonly includeDisabled?: boolean;
  readonly fuzzy?: boolean;
  readonly useWorker?: boolean;
}

export type PuiCommandExecuteResult = 'success' | 'disabled' | 'missing' | 'error';

export type PuiCommandPaletteAnimation = 'macos' | 'minimal' | 'smooth';

export interface PuiCommandPaletteConfig {
  readonly maxResults?: number;
  readonly showRecent?: boolean;
  readonly recentLimit?: number;
  readonly fuzzy?: boolean;
  readonly useWorker?: boolean;
  readonly placeholder?: string;
  readonly emptyLabel?: string;
  readonly emptyDescription?: string;
  /** macOS-style scale + fade from cursor origin (default). Use `smooth` for a fluid fade/slide or `minimal` for a light slide. */
  readonly animation?: PuiCommandPaletteAnimation;
  /** When true, opens anchored near the last pointer position. */
  readonly positionAtCursor?: boolean;
}

export const PUI_COMMAND_DEFAULT_PALETTE_CONFIG: Required<PuiCommandPaletteConfig> = {
  maxResults: 50,
  showRecent: true,
  recentLimit: 5,
  fuzzy: true,
  useWorker: false,
  placeholder: 'Type a command or search…',
  emptyLabel: 'No commands found',
  emptyDescription: 'Try a different search term or check registered commands.',
  animation: 'macos',
  positionAtCursor: true,
};

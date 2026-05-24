export interface PuiDocsNavItem {
  readonly label: string;
  readonly route: readonly string[];
  readonly badge?: string;
}

export interface PuiDocsNavGroup {
  readonly id: string;
  readonly label: string;
  readonly items: readonly PuiDocsNavItem[];
}

export interface PuiDocsTocItem {
  readonly id: string;
  readonly label: string;
  readonly level?: 2 | 3;
}

export interface PuiDocsTab {
  readonly label: string;
  readonly route: readonly string[];
}

export interface PuiDocBreadcrumb {
  readonly label: string;
  readonly route?: readonly string[];
}

export interface PuiDocApiRow {
  readonly name: string;
  readonly type: string;
  readonly defaultValue: string;
  readonly description: string;
}

export interface PuiDocCodeTab {
  readonly id: string;
  readonly label: string;
  readonly code: string;
  readonly language?: string;
  readonly filename?: string;
}

export type PuiDocCalloutVariant = 'info' | 'warning' | 'success';

export interface PuiDocKeyboardShortcut {
  readonly keys: readonly string[];
  readonly description: string;
}

export interface PuiDocA11yItem {
  readonly title: string;
  readonly description: string;
  readonly code?: string;
}

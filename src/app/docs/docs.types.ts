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
}

export interface PuiDocsTab {
  readonly label: string;
  readonly route: readonly string[];
}

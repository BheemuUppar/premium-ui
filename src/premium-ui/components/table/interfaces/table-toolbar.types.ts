import type { PuiTableExportFormat } from './table-export.types';

/** Toolbar visibility — boolean or per-slot configuration. */
export interface PuiTableToolbarConfig {
  readonly search?: boolean;
  readonly export?: boolean;
  readonly density?: boolean;
  readonly filters?: boolean;
}

/** Which export formats appear in the toolbar export menu. */
export interface PuiTableExportableConfig {
  readonly csv?: boolean;
  readonly excel?: boolean;
  readonly json?: boolean;
  readonly pdf?: boolean;
  readonly filename?: string;
  readonly visibleColumnsOnly?: boolean;
  readonly pdfConfig?: {
    readonly title?: string;
    readonly logoUrl?: string;
    readonly orientation?: 'portrait' | 'landscape';
    readonly footer?: string;
    readonly brandColor?: string;
  };
}

export const PUI_TABLE_DEFAULT_EXPORTABLE: Readonly<PuiTableExportableConfig> = {
  csv: true,
  excel: true,
  json: true,
  pdf: false,
};

export const PUI_TABLE_DEFAULT_TOOLBAR: Readonly<PuiTableToolbarConfig> = {
  search: true,
  export: true,
  density: false,
  filters: false,
};

export function resolveToolbarConfig(
  toolbar: boolean | PuiTableToolbarConfig | undefined
): PuiTableToolbarConfig & { visible: boolean } {
  if (toolbar === false) {
    return { visible: false, search: false, export: false, density: false, filters: false };
  }

  if (toolbar === true || toolbar === undefined) {
    return { visible: true, ...PUI_TABLE_DEFAULT_TOOLBAR };
  }

  return {
    visible: true,
    search: toolbar.search ?? PUI_TABLE_DEFAULT_TOOLBAR.search,
    export: toolbar.export ?? PUI_TABLE_DEFAULT_TOOLBAR.export,
    density: toolbar.density ?? PUI_TABLE_DEFAULT_TOOLBAR.density,
    filters: toolbar.filters ?? PUI_TABLE_DEFAULT_TOOLBAR.filters,
  };
}

export function resolveExportableConfig(
  exportable: boolean | PuiTableExportableConfig | undefined
): PuiTableExportableConfig & { enabled: boolean } {
  if (exportable === false || exportable === undefined) {
    return { enabled: false, csv: false, excel: false, json: false, pdf: false };
  }

  if (exportable === true) {
    return { enabled: true, ...PUI_TABLE_DEFAULT_EXPORTABLE };
  }

  return {
    enabled: true,
    csv: exportable.csv ?? PUI_TABLE_DEFAULT_EXPORTABLE.csv,
    excel: exportable.excel ?? PUI_TABLE_DEFAULT_EXPORTABLE.excel,
    json: exportable.json ?? PUI_TABLE_DEFAULT_EXPORTABLE.json,
    pdf: exportable.pdf ?? PUI_TABLE_DEFAULT_EXPORTABLE.pdf,
    filename: exportable.filename,
    visibleColumnsOnly: exportable.visibleColumnsOnly ?? true,
    pdfConfig: exportable.pdfConfig,
  };
}

export function getEnabledExportFormats(
  config: PuiTableExportableConfig & { enabled: boolean }
): readonly PuiTableExportFormat[] {
  if (!config.enabled) {
    return [];
  }

  const formats: PuiTableExportFormat[] = [];
  if (config.csv) formats.push('csv');
  if (config.excel) formats.push('excel');
  if (config.json) formats.push('json');
  if (config.pdf) formats.push('pdf');
  return formats;
}

export function parseTableHeight(value: string | number | undefined, fallback = 420): number {
  if (typeof value === 'number' && value > 0) {
    return value;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.endsWith('px')) {
      const px = Number.parseFloat(trimmed);
      if (!Number.isNaN(px) && px > 0) return px;
    }
    if (trimmed.endsWith('rem')) {
      const rem = Number.parseFloat(trimmed);
      if (!Number.isNaN(rem) && rem > 0) return rem * 16;
    }
    const numeric = Number.parseFloat(trimmed);
    if (!Number.isNaN(numeric) && numeric > 0) return numeric;
  }

  return fallback;
}

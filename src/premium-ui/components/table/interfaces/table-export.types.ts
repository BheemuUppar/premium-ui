import type { PuiTableColumn } from './table-column.types';

export type PuiTableExportFormat = 'csv' | 'excel' | 'json' | 'pdf';

export interface PuiTableExportOptions<T = unknown> {
  readonly format: PuiTableExportFormat;
  readonly filename?: string;
  readonly columns?: readonly PuiTableColumn<T>[];
  readonly title?: string;
  readonly logoUrl?: string;
  readonly orientation?: 'portrait' | 'landscape';
  readonly footer?: string;
  readonly brandColor?: string;
  readonly includeFilteredOnly?: boolean;
}

export interface PuiTableExportResult {
  readonly blob: Blob;
  readonly filename: string;
  readonly mimeType: string;
}

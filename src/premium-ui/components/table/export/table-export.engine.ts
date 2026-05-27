import type { PuiTableColumn } from '../interfaces';
import type { PuiTableExportFormat, PuiTableExportableConfig } from '../interfaces';
import { exportTableData, downloadExportResult } from './table-export.utils';

export interface PuiTableExportEngineOptions<T> {
  readonly rows: readonly T[];
  readonly columns: readonly PuiTableColumn<T>[];
  readonly config: PuiTableExportableConfig & { enabled: boolean };
  readonly format: PuiTableExportFormat;
  readonly onExport?: (format: PuiTableExportFormat) => void;
}

export function runTableExport<T>(options: PuiTableExportEngineOptions<T>): void {
  const { rows, columns, config, format, onExport } = options;

  onExport?.(format);

  const result = exportTableData(rows, columns, {
    format,
    filename: config.filename,
    includeFilteredOnly: config.visibleColumnsOnly ?? true,
    ...config.pdfConfig,
  });

  downloadExportResult(result);
}

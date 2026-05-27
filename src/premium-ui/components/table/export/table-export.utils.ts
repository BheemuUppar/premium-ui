import type { PuiTableColumn, PuiTableExportOptions, PuiTableExportResult } from '../interfaces';
import { formatCellValue, resolveCellValue } from '../utils/row.utils';
import { getVisibleColumns } from '../utils/column.utils';

function escapeCsv(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function exportTableCsv<T>(
  rows: readonly T[],
  columns: readonly PuiTableColumn<T>[],
  filename = 'export.csv'
): PuiTableExportResult {
  const exportColumns = getVisibleColumns(columns).filter((column) => column.exportable);
  const header = exportColumns.map((column) => escapeCsv(column.label)).join(',');
  const body = rows
    .map((row) =>
      exportColumns
        .map((column) => escapeCsv(formatCellValue(resolveCellValue(row, column), row, column)))
        .join(',')
    )
    .join('\n');

  const csv = `${header}\n${body}`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

  return { blob, filename, mimeType: 'text/csv' };
}

export function exportTableExcel<T>(
  rows: readonly T[],
  columns: readonly PuiTableColumn<T>[],
  filename = 'export.csv'
): PuiTableExportResult {
  const exportColumns = getVisibleColumns(columns).filter((column) => column.exportable);
  const header = exportColumns.map((column) => escapeCsv(column.label)).join(',');
  const body = rows
    .map((row) =>
      exportColumns
        .map((column) => escapeCsv(formatCellValue(resolveCellValue(row, column), row, column)))
        .join(',')
    )
    .join('\n');

  const bom = '\uFEFF';
  const blob = new Blob([bom + header + '\n' + body], {
    type: 'application/vnd.ms-excel;charset=utf-8;',
  });

  return {
    blob,
    filename: filename.endsWith('.csv') ? filename.replace(/\.csv$/i, '.xls') : filename,
    mimeType: 'application/vnd.ms-excel',
  };
}

export function exportTableJson<T>(
  rows: readonly T[],
  columns: readonly PuiTableColumn<T>[],
  filename = 'export.json'
): PuiTableExportResult {
  const exportColumns = getVisibleColumns(columns).filter((column) => column.exportable);
  const payload = rows.map((row) => {
    const record: Record<string, unknown> = {};
    for (const column of exportColumns) {
      record[column.key] = resolveCellValue(row, column);
    }
    return record;
  });

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  return { blob, filename, mimeType: 'application/json' };
}

export function exportTablePdf<T>(
  rows: readonly T[],
  columns: readonly PuiTableColumn<T>[],
  options: Pick<PuiTableExportOptions<T>, 'title' | 'logoUrl' | 'orientation' | 'footer' | 'brandColor'> = {}
): PuiTableExportResult {
  const exportColumns = getVisibleColumns(columns).filter((column) => column.exportable);
  const brand = options.brandColor ?? '#4f46e5';
  const title = options.title ?? 'Data Export';
  const orientation = options.orientation ?? 'portrait';

  const headerCells = exportColumns.map((column) => `<th>${column.label}</th>`).join('');
  const bodyRows = rows
    .map((row) => {
      const cells = exportColumns
        .map((column) => `<td>${formatCellValue(resolveCellValue(row, column), row, column)}</td>`)
        .join('');
      return `<tr>${cells}</tr>`;
    })
    .join('');

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <style>
    @page { size: ${orientation}; margin: 24mm; }
    body { font-family: Inter, system-ui, sans-serif; color: #111827; }
    header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
    h1 { margin: 0; font-size: 20px; color: ${brand}; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th { text-align: left; padding: 10px 12px; background: color-mix(in srgb, ${brand} 8%, white); border-bottom: 2px solid ${brand}; }
    td { padding: 10px 12px; border-bottom: 1px solid #e5e7eb; }
    footer { margin-top: 24px; font-size: 11px; color: #6b7280; }
  </style>
</head>
<body>
  <header>
    ${options.logoUrl ? `<img src="${options.logoUrl}" alt="" height="32" />` : ''}
    <h1>${title}</h1>
  </header>
  <table>
    <thead><tr>${headerCells}</tr></thead>
    <tbody>${bodyRows}</tbody>
  </table>
  ${options.footer ? `<footer>${options.footer}</footer>` : ''}
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  return { blob, filename: 'export.html', mimeType: 'text/html' };
}

export function downloadExportResult(result: PuiTableExportResult): void {
  if (typeof document === 'undefined') {
    return;
  }

  const url = URL.createObjectURL(result.blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = result.filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function exportTableData<T>(
  rows: readonly T[],
  columns: readonly PuiTableColumn<T>[],
  options: PuiTableExportOptions<T>
): PuiTableExportResult {
  const exportColumns = options.columns ?? columns;
  const filename = options.filename ?? `export.${options.format === 'excel' ? 'xls' : options.format}`;

  switch (options.format) {
    case 'csv':
      return exportTableCsv(rows, exportColumns, filename);
    case 'excel':
      return exportTableExcel(rows, exportColumns, filename);
    case 'json':
      return exportTableJson(rows, exportColumns, filename);
    case 'pdf':
      return exportTablePdf(rows, exportColumns, options);
    default:
      return exportTableCsv(rows, exportColumns, filename);
  }
}

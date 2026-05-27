import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  PLATFORM_ID,
  booleanAttribute,
  computed,
  contentChildren,
  effect,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { PuiDataProcessorService } from '../../../internal/workers';
import { PuiCheckboxComponent } from '../../checkbox';
import type {
  PuiTableColumn,
  PuiTableColumnFilter,
  PuiTableColumnInput,
  PuiTableExportClick,
  PuiTableExportFormat,
  PuiTableExportableConfig,
  PuiTablePageChangeEvent,
  PuiTableRowKey,
  PuiTableSearchChange,
  PuiTableSelectionChange,
  PuiTableSortDirection,
  PuiTableSortState,
  PuiTableToolbarConfig,
} from '../interfaces';
import {
  parseTableHeight,
  resolveExportableConfig,
  resolveToolbarConfig,
} from '../interfaces/table-toolbar.types';
import {
  PUI_TABLE_DEFAULT_PAGE_SIZE,
  PUI_TABLE_DENSITY_ROW_HEIGHT,
  PUI_TABLE_HEADER_HEIGHT,
  PUI_TABLE_PAGINATION_HEIGHT,
  PUI_TABLE_SEARCH_DEBOUNCE_MS,
  PUI_TABLE_TOOLBAR_HEIGHT,
  type PuiTableDensity,
} from '../table.constants';
import { PuiTablePaginationComponent } from '../pagination';
import { PuiTableToolbarComponent } from '../toolbar';
import {
  PuiTableCellDefDirective,
  PuiTableHeaderDefDirective,
} from '../templates';
import {
  applyColumnFilters,
  applyGlobalSearch,
  applyTableStickyOptions,
  buildGridTemplateColumns,
  findColumnByKey,
  formatCellValue,
  normalizeTableColumns,
  paginateIndices,
  resolveCellValue,
  resolveDisplayColumns,
  resolveRowKey,
  stableSortIndices,
} from '../utils';
import { buildTableWorkerDataset, createTableDatasetId } from '../worker';
import { downloadExportResult, exportTableData } from '../export';
import {
  isAllSelected,
  isPartiallySelected,
  toggleAllSelection,
  toggleRowSelection,
} from '../selection';

@Component({
  selector: 'pui-table',
  imports: [
    NgTemplateOutlet,
    ScrollingModule,
    PuiCheckboxComponent,
    PuiTablePaginationComponent,
    PuiTableToolbarComponent,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'pui-table-host',
    '[style.--pui-table-row-height.px]': 'rowHeight()',
    '[style.--pui-table-header-height.px]': 'headerHeight',
    '[style.--pui-table-shell-height.px]': 'shellHeightPx()',
    '[style.--pui-table-body-height.px]': 'bodyScrollHeightPx()',
  },
})
export class PuiTableComponent<T = unknown> {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly dataProcessor = inject(PuiDataProcessorService);
  private readonly cellTemplates = contentChildren(PuiTableCellDefDirective);
  private readonly headerTemplates = contentChildren(PuiTableHeaderDefDirective);

  readonly data = input<readonly T[]>([]);
  readonly columns = input<readonly PuiTableColumnInput<T>[]>([]);
  readonly rowKey = input<(row: T, index: number) => PuiTableRowKey>();
  readonly loading = input(false, { transform: booleanAttribute });
  readonly searchable = input(true, { transform: booleanAttribute });
  readonly exportable = input<boolean | PuiTableExportableConfig>(false);
  readonly toolbar = input<boolean | PuiTableToolbarConfig>(true);
  readonly paginated = input(true, { transform: booleanAttribute });
  readonly virtualScroll = input(false, { transform: booleanAttribute });
  readonly useWorker = input(false, { transform: booleanAttribute });
  readonly selectable = input(false, { transform: booleanAttribute });
  readonly maxSelection = input<number | null>(null);
  readonly stickyHeader = input(false, { transform: booleanAttribute });
  readonly stickyFirstColumn = input(false, { transform: booleanAttribute });
  readonly stickyLastColumn = input(false, { transform: booleanAttribute });
  readonly height = input<string | number>(420);
  readonly pageSize = model(PUI_TABLE_DEFAULT_PAGE_SIZE);
  readonly pageIndex = model(0);
  readonly searchQuery = model('');
  readonly sortState = model<PuiTableSortState | null>(null);
  readonly columnFilters = model<readonly PuiTableColumnFilter[]>([]);
  readonly selectedKeys = model<readonly PuiTableRowKey[]>([]);
  readonly selectedRows = model<readonly T[]>([]);
  readonly density = input<PuiTableDensity>('comfortable');
  readonly ariaLabel = input('Data table');
  readonly emptyTitle = input('No results');
  readonly emptyDescription = input('Try adjusting your search or filters.');
  readonly tableId = input('default');
  /** When set, skips client pagination and uses this count for the footer (server-side mode). */
  readonly totalRows = input<number | null>(null);

  readonly selectionChange = output<PuiTableSelectionChange<T>>();
  readonly rowClick = output<{ row: T; index: number }>();
  readonly sortChange = output<PuiTableSortState | null>();
  readonly pageChange = output<PuiTablePageChangeEvent>();
  readonly searchChange = output<PuiTableSearchChange>();
  readonly exportClick = output<PuiTableExportClick>();

  protected readonly headerHeight = PUI_TABLE_HEADER_HEIGHT;
  protected readonly skeletonRows = [0, 1, 2, 3, 4];

  private readonly workerIndices = signal<readonly number[] | null>(null);

  protected readonly toolbarConfig = computed(() => resolveToolbarConfig(this.toolbar()));
  protected readonly exportConfig = computed(() => resolveExportableConfig(this.exportable()));

  protected readonly showToolbarSection = computed(() => {
    const cfg = this.toolbarConfig();
    if (!cfg.visible) {
      return false;
    }

    const hasSearch = cfg.search && this.searchable();
    const hasExport = cfg.export && this.exportConfig().enabled;
    return hasSearch || hasExport;
  });

  protected readonly normalizedColumns = computed(() => {
    const sample = this.data()[0];
    return normalizeTableColumns(this.columns(), sample);
  });

  protected readonly visibleColumns = computed(() => {
    const columns = resolveDisplayColumns(this.normalizedColumns(), { selectable: this.selectable() });
    return applyTableStickyOptions(columns, {
      stickyFirstColumn: this.stickyFirstColumn(),
      stickyLastColumn: this.stickyLastColumn(),
    });
  });

  protected readonly rowHeight = computed(() => PUI_TABLE_DENSITY_ROW_HEIGHT[this.density()]);

  protected readonly shellHeightPx = computed(() => parseTableHeight(this.height()));

  protected readonly bodyScrollHeightPx = computed(() => {
    const toolbar = this.showToolbarSection() ? PUI_TABLE_TOOLBAR_HEIGHT : 0;
    const pagination = this.paginated() ? PUI_TABLE_PAGINATION_HEIGHT : 0;
    return Math.max(120, this.shellHeightPx() - toolbar - pagination - PUI_TABLE_HEADER_HEIGHT);
  });

  protected readonly gridTemplateColumns = computed(() =>
    buildGridTemplateColumns(this.visibleColumns())
  );

  protected readonly syncIndices = computed(() => {
    const rows = this.data();
    let indices = rows.map((_, index) => index);
    const columns = this.normalizedColumns();

    const workerResult = this.workerIndices();
    if (workerResult && this.useWorker() && this.isBrowser()) {
      indices = [...workerResult];
    } else {
      indices = applyGlobalSearch(rows, indices, this.searchQuery(), columns);
    }

    indices = applyColumnFilters(rows, indices, this.columnFilters(), columns);

    const sort = this.sortState();
    const sortColumn = sort ? findColumnByKey(columns, sort.columnKey) : undefined;
    indices = stableSortIndices(rows, indices, sort, sortColumn);

    return indices;
  });

  protected readonly processedIndices = computed(() => this.syncIndices());

  protected readonly paginationTotalRows = computed(
    () => this.totalRows() ?? this.processedIndices().length
  );

  protected readonly pagedIndices = computed(() => {
    if (!this.paginated()) {
      return this.processedIndices();
    }

    if (this.totalRows() !== null) {
      return this.processedIndices();
    }

    return paginateIndices(this.processedIndices(), this.pageIndex(), this.pageSize());
  });

  protected readonly selectedSet = computed(() => new Set(this.selectedKeys()));

  protected readonly pageRowKeys = computed(() =>
    this.pagedIndices().map((index) => this.rowKeyAt(index))
  );

  protected readonly allPageSelected = computed(() =>
    this.selectable() && isAllSelected(this.selectedSet(), this.pageRowKeys())
  );

  protected readonly partialPageSelected = computed(() =>
    this.selectable() && isPartiallySelected(this.selectedSet(), this.pageRowKeys())
  );

  constructor() {
    effect(() => {
      const rows = this.data();
      const columns = this.normalizedColumns();
      const query = this.searchQuery();
      const useWorker = this.useWorker() && this.isBrowser();

      if (!useWorker || !this.searchable()) {
        this.workerIndices.set(null);
        return;
      }

      const datasetId = createTableDatasetId(this.tableId());
      const dataset = buildTableWorkerDataset(rows, columns, this.rowKey());

      void this.dataProcessor
        .searchIndices({
          useWorker: true,
          datasetId,
          items: dataset,
          query,
          debounceMs: PUI_TABLE_SEARCH_DEBOUNCE_MS,
        })
        .then((indices) => this.workerIndices.set(indices))
        .catch(() => this.workerIndices.set(null));
    });

    effect(() => {
      this.searchQuery();
      this.columnFilters();
      this.sortState();
      this.pageIndex.set(0);
    });

    effect(() => {
      const keys = this.selectedKeys();
      const rows = keys
        .map((key) => this.data().find((row, index) => this.rowKeyAt(index) === key))
        .filter((row): row is T => row !== undefined);

      const current = this.selectedRows();
      if (current.length === rows.length && current.every((row, index) => row === rows[index])) {
        return;
      }

      this.selectedRows.set(rows);
    });
  }

  protected cellTemplateFor(key: string) {
    return this.cellTemplates().find((def) => def.puiTableCellDef() === key)?.template;
  }

  protected headerTemplateFor(key: string) {
    return this.headerTemplates().find((def) => def.puiTableHeaderDef() === key)?.template;
  }

  protected trackRowIndex = (_: number, rowIndex: number): number => rowIndex;

  protected rowKeyAt(index: number): PuiTableRowKey {
    return resolveRowKey(this.data()[index]!, index, this.rowKey());
  }

  protected isRowSelected(rowIndex: number): boolean {
    return this.selectable() && this.selectedSet().has(this.rowKeyAt(rowIndex));
  }

  protected toggleRowSelection(rowIndex: number, checked: boolean): void {
    if (!this.selectable()) {
      return;
    }

    const key = this.rowKeyAt(rowIndex);
    const next = checked
      ? toggleRowSelection(this.selectedSet(), key, this.maxSelection())
      : (() => {
          const updated = new Set(this.selectedSet());
          updated.delete(key);
          return updated;
        })();
    this.commitSelection(next);
  }

  protected toggleSelectAll(checked: boolean): void {
    if (!this.selectable()) {
      return;
    }

    this.commitSelection(
      toggleAllSelection(this.selectedSet(), this.pageRowKeys(), checked, this.maxSelection())
    );
  }

  protected toggleSort(columnKey: string): void {
    const column = findColumnByKey(this.normalizedColumns(), columnKey);
    if (!column?.sortable) {
      return;
    }

    const current = this.sortState();
    let direction: PuiTableSortDirection = 'asc';

    if (current?.columnKey === columnKey) {
      direction = current.direction === 'asc' ? 'desc' : current.direction === 'desc' ? null : 'asc';
    }

    const next = direction ? { columnKey, direction } : null;
    this.sortState.set(next);
    this.sortChange.emit(next);
  }

  protected sortDirection(columnKey: string): PuiTableSortDirection {
    const sort = this.sortState();
    return sort?.columnKey === columnKey ? sort.direction : null;
  }

  protected ariaSort(columnKey: string): 'ascending' | 'descending' | 'none' {
    const direction = this.sortDirection(columnKey);
    if (direction === 'asc') return 'ascending';
    if (direction === 'desc') return 'descending';
    return 'none';
  }

  protected onHeaderKeydown(event: KeyboardEvent, columnKey: string): void {
    const column = findColumnByKey(this.normalizedColumns(), columnKey);
    if (!column?.sortable) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleSort(columnKey);
    }
  }

  protected onSearchChange(query: string): void {
    this.searchQuery.set(query);
    this.searchChange.emit({ query });
  }

  protected onScrollWheel(event: WheelEvent): void {
    const element = event.currentTarget as HTMLElement | null;
    if (!element) {
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = element;
    const canScrollVertically = scrollHeight > clientHeight + 1;

    if (!canScrollVertically) {
      return;
    }

    const atTop = scrollTop <= 0;
    const atBottom = scrollTop + clientHeight >= scrollHeight - 1;
    const scrollingUp = event.deltaY < 0;
    const scrollingDown = event.deltaY > 0;

    if ((scrollingUp && atTop) || (scrollingDown && atBottom)) {
      return;
    }

    event.stopPropagation();
  }

  protected onPageChange(event: { pageIndex: number; pageSize: number }): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.pageChange.emit(event);
  }

  protected onRowClick(rowIndex: number): void {
    this.rowClick.emit({ row: this.data()[rowIndex]!, index: rowIndex });
  }

  protected onExport(format: PuiTableExportFormat): void {
    this.exportClick.emit({ format });

    const config = this.exportConfig();
    const rows = this.dataProcessor.mapIndices(
      this.data(),
      config.visibleColumnsOnly ? this.processedIndices() : this.data().map((_, i) => i)
    );

    const result = exportTableData(rows, this.visibleColumns(), {
      format,
      filename: config.filename,
      includeFilteredOnly: config.visibleColumnsOnly,
      ...config.pdfConfig,
    });
    downloadExportResult(result);
  }

  protected getRow(rowIndex: number): T {
    return this.data()[rowIndex]!;
  }

  protected getCellValue(rowIndex: number, column: PuiTableColumn<T>): unknown {
    return resolveCellValue(this.getRow(rowIndex), column);
  }

  protected formatValue(rowIndex: number, column: PuiTableColumn<T>): string {
    const row = this.getRow(rowIndex);
    return formatCellValue(resolveCellValue(row, column), row, column);
  }

  protected badgeVariant(column: PuiTableColumn<T>, value: unknown): string {
    if (column.badgeVariant) {
      return column.badgeVariant;
    }

    const text = String(value).toLowerCase();
    if (text.includes('active') || text.includes('success') || text.includes('paid')) return 'success';
    if (text.includes('pending') || text.includes('warning') || text.includes('open')) return 'warning';
    if (text.includes('inactive') || text.includes('error') || text.includes('overdue')) return 'danger';
    return 'default';
  }

  protected isSelectionColumn(column: PuiTableColumn<T>): boolean {
    return column.type === 'selection';
  }

  private commitSelection(next: Set<PuiTableRowKey>): void {
    const keys = [...next];
    const rows = keys
      .map((key) => this.data().find((row, index) => this.rowKeyAt(index) === key))
      .filter((row): row is T => row !== undefined);

    this.selectedKeys.set(keys);
    this.selectedRows.set(rows);
    this.selectionChange.emit({ selectedKeys: keys, selectedRows: rows, count: rows.length });
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}

import { ChangeDetectionStrategy, Component, computed, effect, inject, model, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { map } from 'rxjs';
import {
  PUI_TABLE_DEMO_INVOICES,
  PUI_TABLE_DEMO_TICKETS,
  PUI_TABLE_DEMO_USERS,
  PuiTableCellDefDirective,
  PuiTableComponent,
  generateInvoiceDataset,
  generateLargeUserDataset,
  type PuiTableUserRow,
} from '../../../../premium-ui/components/table';
import type { PuiTableColumnFilter } from '../../../../premium-ui/components/table';
import { PuiButtonComponent } from '../../../../premium-ui/components/button';
import { PuiCheckboxComponent } from '../../../../premium-ui/components/checkbox';
import { PuiSelectComponent } from '../../../../premium-ui/components/select';
import { PuiSwitchComponent } from '../../../../premium-ui/components/switch';
import type { PuiDocApiRow, PuiDocA11yItem, PuiDocCodeTab, PuiDocSelfContainedExample, PuiDocThemeToken, PuiDocsTab } from '../../docs.types';
import {
  PuiDocApiTableComponent,
  PuiDocA11yListComponent,
  PuiDocExampleComponent,
  PuiDocInstallationComponent,
  PuiDocRelatedLinksComponent,
  PuiDocThemeTokensComponent,
  buildSelfContainedExampleTabs,
  toSelectOptions,
} from '../../shared';
import { useDocsPageSeo } from '../../seo/use-docs-page-seo';
import { getRelatedLinks } from '../../seo/docs-seo.service';
import { TABLE_DOC_EXAMPLES } from './table-docs.examples';

type PuiDocsTableTab =
  | 'overview'
  | 'examples'
  | 'api'
  | 'accessibility'
  | 'theming'
  | 'playground';

@Component({
  selector: 'app-table-docs',
  imports: [
    PuiTableComponent,
    PuiTableCellDefDirective,
    PuiButtonComponent,
    PuiSwitchComponent,
    PuiCheckboxComponent,
    PuiSelectComponent,
    PuiDocApiTableComponent,
    PuiDocA11yListComponent,
    PuiDocExampleComponent,
    PuiDocInstallationComponent,
    PuiDocRelatedLinksComponent,
    PuiDocThemeTokensComponent,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './table-docs.component.html',
  styleUrl: './table-docs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableDocsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly routeTab = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('tab') ?? 'overview')),
    { initialValue: 'overview' }
  );

  protected readonly currentTab = computed(() => {
    const tab = this.routeTab();
    return this.isDocsTab(tab) ? tab : 'overview';
  });

  protected readonly tabs: readonly PuiDocsTab[] = [
    { label: 'Overview', route: ['/docs/components/table/overview'] },
    { label: 'Examples', route: ['/docs/components/table/examples'] },
    { label: 'API Guide', route: ['/docs/components/table/api'] },
    { label: 'Accessibility', route: ['/docs/components/table/accessibility'] },
    { label: 'Theming', route: ['/docs/components/table/theming'] },
    { label: 'Playground', route: ['/docs/components/table/playground'] },
  ];

  constructor() {
    useDocsPageSeo({ slug: 'table', tab: this.currentTab });

    effect(() => {
      const page = this.serverPageIndex();
      const size = this.serverPageSize();
      this.simulateServerFetch(page, size);
    });
  }

  protected readonly relatedLinks = getRelatedLinks('table');
  protected readonly examples = TABLE_DOC_EXAMPLES;

  protected readonly users = PUI_TABLE_DEMO_USERS;
  protected readonly invoices = PUI_TABLE_DEMO_INVOICES;
  protected readonly tickets = PUI_TABLE_DEMO_TICKETS;
  protected readonly largeUsers = generateLargeUserDataset(500);
  protected readonly manyInvoices = generateInvoiceDataset(120);

  protected readonly basicColumns = ['name', 'email', 'department', 'status', 'revenue'] as const;
  protected readonly invoiceColumns = ['id', 'customer', { key: 'amount', type: 'currency' as const, sortable: true, align: 'end' as const }, { key: 'status', type: 'badge' as const, sortable: true }, 'plan'] as const;
  protected readonly actionColumns = [
    'name',
    { key: 'status', type: 'badge' as const, sortable: true },
    { key: 'revenue', type: 'currency' as const, align: 'end' as const },
    { key: 'actions', type: 'custom' as const, sticky: 'right' as const, exportable: false },
  ] as const;
  protected readonly customActiveColumns = [
    'name',
    'email',
    { key: 'active', label: 'Active', type: 'custom' as const, exportable: false },
  ] as const;
  protected readonly ticketColumns = [
    { key: 'id', label: 'Ticket', sticky: 'left' as const, width: '110px' },
    'subject',
    { key: 'priority', type: 'badge' as const, sortable: true },
    { key: 'status', type: 'badge' as const, sortable: true },
    'assignee',
    'updated',
    { key: 'actions', type: 'custom' as const, sticky: 'right' as const, width: '96px', exportable: false },
  ] as const;
  protected readonly wideColumns = [
    { key: 'id', width: '80px' },
    'name',
    'email',
    { key: 'role', width: '140px' },
    'department',
    { key: 'status', type: 'badge' as const },
    { key: 'revenue', type: 'currency' as const, align: 'end' as const, width: '120px' },
    'lastActive',
  ] as const;

  protected readonly statusColumnFilters = model<readonly PuiTableColumnFilter[]>([
    { columnKey: 'status', type: 'text', operator: 'equals', value: 'Active' },
  ]);

  protected readonly serverTotal = 500;
  protected readonly serverPageIndex = model(0);
  protected readonly serverPageSize = model(25);
  protected readonly serverLoading = signal(false);
  protected readonly serverRows = signal<readonly PuiTableUserRow[]>([]);

  protected readonly playgroundVirtual = signal(false);
  protected readonly playgroundWorker = signal(false);
  protected readonly playgroundSelectable = signal(false);
  protected readonly playgroundExport = signal(false);
  protected readonly playgroundHeight = signal(460);
  protected readonly heightOptions = toSelectOptions(['360', '420', '460', '520']);

  protected readonly playgroundData = computed(() =>
    this.playgroundVirtual() ? generateLargeUserDataset(8000) : this.users
  );

  protected readonly playgroundTabs = computed((): readonly PuiDocCodeTab[] => {
    const html = `<pui-table
  [data]="users"
  [columns]="columns"
  [height]="${this.playgroundHeight()}"
  [virtualScroll]="${this.playgroundVirtual()}"
  [useWorker]="${this.playgroundWorker()}"
  [selectable]="${this.playgroundSelectable()}"
  [exportable]="${this.playgroundExport() ? '{ csv: true, excel: true, json: true }' : 'false'}"
>
  <ng-template puiTableCellDef="actions" let-row>
    <pui-button size="sm" variant="outline">View</pui-button>
  </ng-template>
</pui-table>`;

    const typescript = `import { Component } from '@angular/core';
import {
  PuiTableComponent,
  PuiTableCellDefDirective,
  type PuiTableColumnInput,
  generateLargeUserDataset,
} from '@premium-ui/components/table';
import { PuiButtonComponent } from '@premium-ui/components/button';

interface UserRow {
  id: number;
  name: string;
  email: string;
  status: 'Active' | 'Inactive' | 'Pending';
  revenue: number;
}

@Component({
  selector: 'app-table-playground',
  imports: [PuiTableComponent, PuiTableCellDefDirective, PuiButtonComponent],
  templateUrl: './table-playground.component.html',
})
export class TablePlaygroundComponent {
  readonly users = ${this.playgroundVirtual() ? 'generateLargeUserDataset(8000)' : `[
    { id: 1, name: 'Sarah Chen', email: 'sarah.chen@linear.app', status: 'Active', revenue: 84200 },
    { id: 2, name: 'Marcus Johnson', email: 'marcus.j@notion.so', status: 'Active', revenue: 61500 },
  ]`};

  readonly columns: PuiTableColumnInput<UserRow>[] = [
    'name',
    { key: 'status', type: 'badge', sortable: true },
    { key: 'revenue', type: 'currency', align: 'end' },
    { key: 'actions', type: 'custom', sticky: 'right', exportable: false },
  ];
}`;

    return buildSelfContainedExampleTabs({ id: 'table-playground', html, typescript });
  });

  protected exampleTabs(example: PuiDocSelfContainedExample): readonly PuiDocCodeTab[] {
    return buildSelfContainedExampleTabs(example);
  }

  protected readonly inputRows: readonly PuiDocApiRow[] = [
    {
      name: 'data',
      type: 'readonly T[]',
      defaultValue: '[]',
      description: 'Typed row array. Each column key should map to a property on T unless using a custom template column.',
      example: '[data]="users"',
    },
    {
      name: 'columns',
      type: 'PuiTableColumnInput<T>[]',
      defaultValue: '[]',
      description: 'Column order in the array defines render order. Use strings for quick setup or objects for sortable, sticky, and template columns.',
      example: "['name', { key: 'status', type: 'badge', sortable: true }]",
    },
    {
      name: 'height',
      type: 'string | number',
      defaultValue: '420',
      description: 'Fixed shell height (px). The body scrolls internally — the docs page and parent layout stay stable.',
      example: '[height]="480" or height="32rem"',
    },
    {
      name: 'toolbar',
      type: 'boolean | PuiTableToolbarConfig',
      defaultValue: 'true',
      description: 'Per-slot toolbar visibility: search, export, density, filters. Density controls are off by default.',
      example: "[toolbar]=\"{ search: true, export: true, density: false }\"",
    },
    {
      name: 'exportable',
      type: 'boolean | PuiTableExportableConfig',
      defaultValue: 'false',
      description: 'Enables a single Export dropdown. Configure csv, excel, json, pdf, filename, and visibleColumnsOnly.',
      example: "[exportable]=\"{ csv: true, excel: true, json: true, pdf: false }\"",
    },
    {
      name: 'selectable',
      type: 'boolean',
      defaultValue: 'false',
      description: 'When true, injects a checkbox column automatically. When false, any selection columns in config are hidden.',
      example: '[selectable]="true" [(selectedKeys)]="selectedKeys"',
    },
    {
      name: 'searchable',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Enables global search across searchable columns.',
      example: '[searchable]="true"',
    },
    {
      name: 'useWorker',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Offloads global search to a Web Worker. Requires a stable tableId per dataset.',
      example: '[useWorker]="true" tableId="admin-users"',
    },
    {
      name: 'virtualScroll',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Explicit CDK virtual scroll opt-in. Disable pagination when virtualizing the full dataset.',
      example: '[virtualScroll]="true" [paginated]="false"',
    },
    {
      name: 'paginated',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Shows pagination footer with page size selector.',
      example: '[paginated]="true" [(pageSize)]="pageSize"',
    },
    {
      name: 'pageSize',
      type: 'number',
      defaultValue: '10',
      description: 'Two-way model. Updates when the user changes page size in the footer.',
      example: '[(pageSize)]="pageSize"',
    },
    {
      name: 'totalRows',
      type: 'number | null',
      defaultValue: 'null',
      description: 'Server-side row count. When set, client pagination is skipped and data should contain only the current page.',
      example: '[totalRows]="500" [loading]="loading()"',
    },
    {
      name: 'density',
      type: 'compact | comfortable | spacious',
      defaultValue: 'comfortable',
      description: 'Row density via input only — not shown in toolbar unless toolbar.density is enabled.',
      example: "[density]=\"'compact'\"",
    },
    {
      name: 'stickyHeader',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Keeps the header row visible while scrolling the table body. Opt-in only.',
      example: '[stickyHeader]="true"',
    },
    {
      name: 'stickyFirstColumn',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Pins the first data column to the left edge during horizontal scroll. Respects explicit column.sticky.',
      example: '[stickyFirstColumn]="true"',
    },
    {
      name: 'stickyLastColumn',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Pins the last column to the right edge during horizontal scroll. Useful for action columns.',
      example: '[stickyLastColumn]="true"',
    },
    {
      name: 'selectedKeys',
      type: 'readonly PuiTableRowKey[]',
      defaultValue: '[]',
      description: 'Two-way model of selected row keys. Works with selectable for controlled multi-select.',
      example: '[(selectedKeys)]="selectedKeys"',
    },
    {
      name: 'selectedRows',
      type: 'readonly T[]',
      defaultValue: '[]',
      description: 'Two-way model of selected row objects. Syncs from selectedKeys for parent integration.',
      example: '[(selectedRows)]="selectedRows"',
    },
    {
      name: 'sortState',
      type: 'PuiTableSortState | null',
      defaultValue: 'null',
      description: 'Two-way model for active sort column and direction.',
      example: '[(sortState)]="sortState"',
    },
    {
      name: 'searchQuery',
      type: 'string',
      defaultValue: "''",
      description: 'Two-way model for toolbar search text.',
      example: '[(searchQuery)]="query"',
    },
    {
      name: 'pageIndex',
      type: 'number',
      defaultValue: '0',
      description: 'Two-way model for the active page index.',
      example: '[(pageIndex)]="pageIndex"',
    },
    {
      name: 'columnFilters',
      type: 'readonly PuiTableColumnFilter[]',
      defaultValue: '[]',
      description: 'Two-way model for programmatic column filters.',
      example: '[(columnFilters)]="filters"',
    },
  ];

  protected readonly outputRows: readonly PuiDocApiRow[] = [
    {
      name: 'rowClick',
      type: '{ row: T; index: number }',
      defaultValue: '-',
      description: 'Emits when a body row is clicked. Use for navigation or detail drawers.',
      example: '(rowClick)="onRowClick($event)"',
    },
    {
      name: 'selectionChange',
      type: 'PuiTableSelectionChange<T>',
      defaultValue: '-',
      description: 'Emits selectedKeys, selectedRows, and count whenever selection changes.',
      example: '(selectionChange)="onSelection($event)"',
    },
    {
      name: 'sortChange',
      type: 'PuiTableSortState | null',
      defaultValue: '-',
      description: 'Emits when a sortable header toggles sort direction.',
      example: '(sortChange)="onSort($event)"',
    },
    {
      name: 'pageChange',
      type: 'PuiTablePageChangeEvent',
      defaultValue: '-',
      description: 'Emits pageIndex and pageSize when the user changes pagination.',
      example: '(pageChange)="fetchPage($event)"',
    },
    {
      name: 'searchChange',
      type: 'PuiTableSearchChange',
      defaultValue: '-',
      description: 'Emits when the toolbar search query changes.',
      example: '(searchChange)="onSearch($event)"',
    },
    {
      name: 'exportClick',
      type: 'PuiTableExportClick',
      defaultValue: '-',
      description: 'Emits before the built-in export download runs. Hook analytics or custom export flows.',
      example: '(exportClick)="trackExport($event)"',
    },
  ];

  protected readonly a11yItems: readonly PuiDocA11yItem[] = [
    {
      category: 'aria',
      title: 'Grid semantics',
      code: 'role="grid"',
      description: 'The table region uses role="grid" with columnheader and gridcell roles on header and body cells.',
    },
    {
      category: 'aria',
      title: 'Sortable headers',
      code: 'aria-sort',
      description: 'Sortable columns expose ascending, descending, or none via aria-sort on the header cell.',
    },
    {
      category: 'keyboard',
      title: 'Header keyboard support',
      code: 'Enter / Space',
      description: 'Sortable headers are focusable and toggle sort direction with Enter or Space.',
    },
    {
      category: 'screen-reader',
      title: 'Selection labels',
      code: 'aria-label',
      description: 'Row and select-all checkboxes include descriptive aria-label text. Selection column only renders when selectable is enabled.',
    },
    {
      category: 'focus',
      title: 'Scroll containment',
      description: 'Internal scroll uses overscroll-behavior: contain so focus and scroll stay inside the table viewport.',
    },
  ];

  protected readonly themeTokens: readonly PuiDocThemeToken[] = [
    {
      name: '--pui-table-shell-height',
      defaultValue: '420px',
      description: 'Total table shell height including header and pagination.',
    },
    {
      name: '--pui-table-row-height',
      defaultValue: '48px',
      description: 'Default body row height at comfortable density.',
    },
    {
      name: '--pui-table-header-height',
      defaultValue: '44px',
      description: 'Sticky header row height.',
    },
    {
      name: '--pui-table-header-bg',
      defaultValue: 'surface mix',
      description: 'Header background — increase contrast for dense admin grids.',
    },
    {
      name: '--pui-table-row-hover',
      defaultValue: 'primary 5%',
      description: 'Row hover background tint.',
    },
    {
      name: '--pui-table-border',
      defaultValue: 'border 68%',
      description: 'Outer shell and cell divider color.',
    },
  ];

  protected readonly themeScss = `:host {
  --pui-table-shell-height: 480px;
  --pui-table-row-height: 44px;
  --pui-table-header-height: 40px;
  --pui-table-header-bg: color-mix(in srgb, var(--pui-color-surface) 88%, var(--pui-color-text) 8%);
  --pui-table-row-hover: color-mix(in srgb, var(--pui-color-primary) 6%, transparent);
}`;

  protected setPlaygroundHeight(value: unknown): void {
    const parsed = Number(value);
    if (!Number.isNaN(parsed) && parsed > 0) {
      this.playgroundHeight.set(parsed);
    }
  }

  private simulateServerFetch(page: number, size: number): void {
    this.serverLoading.set(true);
    const all = generateLargeUserDataset(this.serverTotal);
    const rows = all.slice(page * size, (page + 1) * size);

    const commit = (): void => {
      this.serverRows.set(rows);
      this.serverLoading.set(false);
    };

    if (isPlatformBrowser(this.platformId)) {
      window.setTimeout(commit, 350);
      return;
    }

    commit();
  }

  private isDocsTab(tab: string): tab is PuiDocsTableTab {
    return ['overview', 'examples', 'api', 'accessibility', 'theming', 'playground'].includes(tab);
  }
}

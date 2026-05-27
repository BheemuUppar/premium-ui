import type { PuiDocSelfContainedExample } from '../../docs.types';

const USER_ROWS = `  readonly users: UserRow[] = [
    {
      id: 1,
      name: 'Sarah Chen',
      email: 'sarah.chen@linear.app',
      role: 'Engineering',
      department: 'Platform',
      status: 'Active',
      revenue: 84200,
      lastActive: '2026-05-22',
      active: true,
    },
    {
      id: 2,
      name: 'Marcus Johnson',
      email: 'marcus.j@notion.so',
      role: 'Design',
      department: 'Product',
      status: 'Active',
      revenue: 61500,
      lastActive: '2026-05-21',
      active: true,
    },
    {
      id: 3,
      name: 'Elena Rodriguez',
      email: 'elena.r@airtable.com',
      role: 'Product',
      department: 'Growth',
      status: 'Pending',
      revenue: 92800,
      lastActive: '2026-05-20',
      active: false,
    },
  ];`;

const USER_INTERFACE = `interface UserRow {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'Active' | 'Inactive' | 'Pending';
  revenue: number;
  lastActive: string;
  active: boolean;
}`;

const INVOICE_INTERFACE = `interface InvoiceRow {
  id: string;
  customer: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  plan: string;
}`;

const INVOICE_ROWS = `  readonly invoices: InvoiceRow[] = [
    { id: 'INV-2401', customer: 'Acme Corp', amount: 12400, status: 'Paid', plan: 'Enterprise' },
    { id: 'INV-2402', customer: 'Northwind Labs', amount: 4200, status: 'Pending', plan: 'Pro' },
    { id: 'INV-2403', customer: 'Globex', amount: 8900, status: 'Overdue', plan: 'Pro' },
  ];`;

const TICKET_INTERFACE = `interface TicketRow {
  id: string;
  subject: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In progress' | 'Resolved';
  assignee: string;
  updated: string;
}`;

const TICKET_ROWS = `  readonly tickets: TicketRow[] = [
    {
      id: 'TCK-4412',
      subject: 'SSO login failing for Okta',
      priority: 'High',
      status: 'In progress',
      assignee: 'Sarah Chen',
      updated: '2026-05-23',
    },
    {
      id: 'TCK-4413',
      subject: 'Export timeout on large datasets',
      priority: 'Medium',
      status: 'Open',
      assignee: 'Marcus Johnson',
      updated: '2026-05-22',
    },
  ];`;

function tsExample(config: {
  selector: string;
  className: string;
  imports: string;
  types?: string;
  body: string;
}): string {
  return `import { Component${config.body.includes('signal') || config.body.includes('model') || config.body.includes('effect') ? ', signal, model, effect' : ''}${config.body.includes('inject') ? ', inject, PLATFORM_ID' : ''} } from '@angular/core';
${config.body.includes('isPlatformBrowser') ? "import { isPlatformBrowser } from '@angular/common';\n" : ''}${config.imports}

${config.types ? `${config.types}\n\n` : ''}@Component({
  selector: '${config.selector}',
  imports: [PuiTableComponent${config.imports.includes('PuiTableCellDefDirective') ? ', PuiTableCellDefDirective' : ''}${config.imports.includes('PuiButtonComponent') ? ', PuiButtonComponent' : ''}${config.imports.includes('PuiSwitchComponent') ? ', PuiSwitchComponent' : ''}],
  templateUrl: './${config.selector.replace('app-', '')}.component.html',
})
export class ${config.className} {
${config.body}
}`;
}

const TABLE_IMPORT = `import {
  PuiTableComponent,
  type PuiTableColumnInput,
  type PuiTableColumnFilter,
  type PuiTableExportableConfig,
  generateLargeUserDataset,
  generateInvoiceDataset,
} from '@premium-ui/components/table';`;

const CELL_IMPORT = `import { PuiTableCellDefDirective } from '@premium-ui/components/table';`;
const BTN_IMPORT = `import { PuiButtonComponent } from '@premium-ui/components/button';`;
const SW_IMPORT = `import { PuiSwitchComponent } from '@premium-ui/components/switch';`;

export const TABLE_DOC_EXAMPLES: readonly PuiDocSelfContainedExample[] = [
  {
    id: 'basic-table',
    title: 'Team members',
    description: 'Users directory with string columns — labels and types inferred from row data.',
    html: `<pui-table
  [data]="users"
  [columns]="columns"
  [toolbar]="false"
  [paginated]="false"
  [height]="360"
/>`,
    typescript: tsExample({
      selector: 'app-basic-table-example',
      className: 'BasicTableExampleComponent',
      imports: TABLE_IMPORT,
      types: USER_INTERFACE,
      body: `${USER_ROWS}

  readonly columns: PuiTableColumnInput<UserRow>[] = [
    'name',
    'email',
    'department',
    'status',
    'revenue',
  ];`,
    }),
  },
  {
    id: 'searchable-table',
    title: 'User search',
    description: 'Filter team members across name, email, and department from the toolbar.',
    html: `<pui-table
  [data]="users"
  [columns]="columns"
  [searchable]="true"
  [exportable]="false"
  [height]="400"
/>`,
    typescript: tsExample({
      selector: 'app-searchable-table-example',
      className: 'SearchableTableExampleComponent',
      imports: TABLE_IMPORT,
      types: USER_INTERFACE,
      body: `${USER_ROWS}

  readonly columns: PuiTableColumnInput<UserRow>[] = ['name', 'email', 'department', 'status', 'revenue'];`,
    }),
  },
  {
    id: 'sortable-table',
    title: 'Invoice ledger',
    description: 'Billing table with sortable amount and status columns for finance workflows.',
    html: `<pui-table
  [data]="invoices"
  [columns]="columns"
  [toolbar]="{ search: false, export: false }"
  [height]="380"
/>`,
    typescript: tsExample({
      selector: 'app-sortable-table-example',
      className: 'SortableTableExampleComponent',
      imports: TABLE_IMPORT,
      types: INVOICE_INTERFACE,
      body: `${INVOICE_ROWS}

  readonly columns: PuiTableColumnInput<InvoiceRow>[] = [
    'id',
    'customer',
    { key: 'amount', type: 'currency', sortable: true, align: 'end' },
    { key: 'status', type: 'badge', sortable: true },
    'plan',
  ];`,
    }),
  },
  {
    id: 'paginated-table',
    title: 'Orders history',
    description: '120 invoice rows paginated inside a fixed-height shell — footer stays outside the scroll region.',
    html: `<pui-table
  [data]="invoices"
  [columns]="columns"
  [paginated]="true"
  [pageSize]="25"
  [height]="460"
  [exportable]="false"
/>`,
    typescript: tsExample({
      selector: 'app-paginated-table-example',
      className: 'PaginatedTableExampleComponent',
      imports: TABLE_IMPORT,
      types: INVOICE_INTERFACE,
      body: `  // Load from API or generate for demos
  readonly invoices = generateInvoiceDataset(120);

  readonly columns: PuiTableColumnInput<InvoiceRow>[] = [
    'id',
    'customer',
    { key: 'amount', type: 'currency', sortable: true, align: 'end' },
    { key: 'status', type: 'badge', sortable: true },
    'plan',
  ];`,
    }),
  },
  {
    id: 'selectable-table',
    title: 'Bulk user actions',
    description: 'Multi-select with controlled selectedKeys, selectedRows, and selectionChange for bulk operations.',
    html: `<pui-table
  [data]="users"
  [columns]="columns"
  [selectable]="true"
  [(selectedKeys)]="selectedKeys"
  [(selectedRows)]="selectedRows"
  (selectionChange)="onSelectionChange($event)"
  [exportable]="false"
  [height]="420"
/>`,
    typescript: tsExample({
      selector: 'app-selectable-table-example',
      className: 'SelectableTableExampleComponent',
      imports: `${TABLE_IMPORT}
import type { PuiTableRowKey, PuiTableSelectionChange } from '@premium-ui/components/table';`,
      types: USER_INTERFACE,
      body: `${USER_ROWS}

  readonly columns: PuiTableColumnInput<UserRow>[] = ['name', 'email', 'department', 'status', 'revenue'];

  readonly selectedKeys: PuiTableRowKey[] = [];
  readonly selectedRows: UserRow[] = [];

  onSelectionChange(event: PuiTableSelectionChange<UserRow>): void {
    console.log(\`Selected \${event.count} users\`, event.selectedRows);
  }`,
    }),
  },
  {
    id: 'exportable-table',
    title: 'Billing export',
    description: 'Finance team exports filtered invoice data as CSV, Excel, or JSON from one menu.',
    html: `<pui-table
  [data]="invoices"
  [columns]="columns"
  [exportable]="exportConfig"
  [height]="400"
/>`,
    typescript: tsExample({
      selector: 'app-exportable-table-example',
      className: 'ExportableTableExampleComponent',
      imports: TABLE_IMPORT,
      types: INVOICE_INTERFACE,
      body: `${INVOICE_ROWS}

  readonly columns: PuiTableColumnInput<InvoiceRow>[] = [
    'id',
    'customer',
    { key: 'amount', type: 'currency', align: 'end' },
    { key: 'status', type: 'badge' },
    'plan',
  ];

  readonly exportConfig: PuiTableExportableConfig = {
    csv: true,
    excel: true,
    json: true,
    pdf: false,
    filename: 'invoices-export',
    visibleColumnsOnly: true,
  };`,
    }),
  },
  {
    id: 'virtualized-table',
    title: 'Analytics dataset',
    description: '10k user rows virtualized for product analytics dashboards without pagination.',
    html: `<pui-table
  [data]="users"
  [columns]="columns"
  [virtualScroll]="true"
  [paginated]="false"
  [toolbar]="{ search: true, export: false }"
  [height]="520"
/>`,
    typescript: tsExample({
      selector: 'app-virtualized-table-example',
      className: 'VirtualizedTableExampleComponent',
      imports: TABLE_IMPORT,
      types: USER_INTERFACE,
      body: `  readonly users = generateLargeUserDataset(10000);

  readonly columns: PuiTableColumnInput<UserRow>[] = ['name', 'email', 'department', 'status', 'revenue'];`,
    }),
  },
  {
    id: 'worker-table',
    title: 'Large user directory',
    description: '5k-row org chart with worker-backed search so typing stays responsive.',
    html: `<pui-table
  [data]="users"
  [columns]="columns"
  [useWorker]="true"
  [searchable]="true"
  [exportable]="false"
  [height]="480"
  tableId="admin-users"
/>`,
    typescript: tsExample({
      selector: 'app-worker-table-example',
      className: 'WorkerTableExampleComponent',
      imports: TABLE_IMPORT,
      types: USER_INTERFACE,
      body: `  readonly users = generateLargeUserDataset(5000);

  readonly columns: PuiTableColumnInput<UserRow>[] = ['name', 'email', 'department', 'status', 'revenue'];`,
    }),
  },
  {
    id: 'action-column-table',
    title: 'User management',
    description: 'Admin table with a sticky Edit action column for per-row operations.',
    html: `<pui-table
  [data]="users"
  [columns]="columns"
  [toolbar]="false"
  [paginated]="false"
  [height]="380"
>
  <ng-template puiTableCellDef="actions" let-row>
    <pui-button size="sm" variant="ghost" (click)="editUser(row)">Edit</pui-button>
  </ng-template>
</pui-table>`,
    typescript: tsExample({
      selector: 'app-action-column-table-example',
      className: 'ActionColumnTableExampleComponent',
      imports: `${TABLE_IMPORT}
${CELL_IMPORT}
${BTN_IMPORT}`,
      types: USER_INTERFACE,
      body: `${USER_ROWS}

  readonly columns: PuiTableColumnInput<UserRow>[] = [
    'name',
    { key: 'status', type: 'badge', sortable: true },
    { key: 'revenue', type: 'currency', align: 'end' },
    { key: 'actions', type: 'custom', sticky: 'right', exportable: false },
  ];

  editUser(row: UserRow): void {
    console.log('Edit', row.id);
  }`,
    }),
  },
  {
    id: 'custom-switch-column',
    title: 'Permissions toggles',
    description: 'Role permissions grid with inline switches bound to each member row.',
    html: `<pui-table
  [data]="users"
  [columns]="columns"
  [toolbar]="{ search: true, export: false }"
  [height]="380"
>
  <ng-template puiTableCellDef="active" let-row>
    <pui-switch
      [checked]="row.active"
      size="sm"
      ariaLabel="Toggle active status for {{ row.name }}"
      (checkedChange)="toggleActive(row, $event)"
    />
  </ng-template>
</pui-table>`,
    typescript: tsExample({
      selector: 'app-custom-switch-column-example',
      className: 'CustomSwitchColumnExampleComponent',
      imports: `${TABLE_IMPORT}
${CELL_IMPORT}
${SW_IMPORT}`,
      types: USER_INTERFACE,
      body: `${USER_ROWS}

  readonly columns: PuiTableColumnInput<UserRow>[] = [
    'name',
    'email',
    { key: 'active', label: 'Active', type: 'custom', exportable: false },
  ];

  toggleActive(row: UserRow, active: boolean): void {
    row.active = active;
  }`,
    }),
  },
  {
    id: 'filterable-table',
    title: 'Active users filter',
    description: 'Programmatic columnFilters to show only Active team members in an admin view.',
    html: `<pui-table
  [data]="users"
  [columns]="columns"
  [(columnFilters)]="columnFilters"
  [toolbar]="{ search: true, export: false }"
  [height]="360"
/>`,
    typescript: tsExample({
      selector: 'app-filterable-table-example',
      className: 'FilterableTableExampleComponent',
      imports: TABLE_IMPORT,
      types: USER_INTERFACE,
      body: `${USER_ROWS}

  readonly columns: PuiTableColumnInput<UserRow>[] = ['name', 'email', 'department', 'status', 'revenue'];

  readonly columnFilters = model<PuiTableColumnFilter[]>([
    { columnKey: 'status', type: 'text', operator: 'equals', value: 'Active' },
  ]);`,
    }),
  },
  {
    id: 'sticky-header-table',
    title: 'Support ticket queue',
    description: 'Sticky header plus first/last column pinning for wide support dashboards.',
    html: `<pui-table
  [data]="tickets"
  [columns]="columns"
  [stickyHeader]="true"
  [stickyFirstColumn]="true"
  [stickyLastColumn]="true"
  [toolbar]="false"
  [paginated]="false"
  [height]="320"
>
  <ng-template puiTableCellDef="actions" let-row>
    <pui-button size="sm" variant="ghost">Open</pui-button>
  </ng-template>
</pui-table>`,
    typescript: tsExample({
      selector: 'app-sticky-header-table-example',
      className: 'StickyHeaderTableExampleComponent',
      imports: `${TABLE_IMPORT}
${CELL_IMPORT}
${BTN_IMPORT}`,
      types: TICKET_INTERFACE,
      body: `${TICKET_ROWS}

  readonly columns: PuiTableColumnInput<TicketRow>[] = [
    { key: 'id', label: 'Ticket', sticky: 'left', width: '110px' },
    'subject',
    { key: 'priority', type: 'badge', sortable: true },
    { key: 'status', type: 'badge', sortable: true },
    'assignee',
    'updated',
    { key: 'actions', type: 'custom', sticky: 'right', width: '96px', exportable: false },
  ];`,
    }),
  },
  {
    id: 'large-dataset-table',
    title: 'Revenue records',
    description: 'High-volume billing ledger with 50 rows per page inside a fixed shell.',
    html: `<pui-table
  [data]="invoices"
  [columns]="columns"
  [pageSize]="50"
  [height]="480"
  [exportable]="false"
/>`,
    typescript: tsExample({
      selector: 'app-large-dataset-table-example',
      className: 'LargeDatasetTableExampleComponent',
      imports: TABLE_IMPORT,
      types: INVOICE_INTERFACE,
      body: `  readonly invoices = generateInvoiceDataset(120);

  readonly columns: PuiTableColumnInput<InvoiceRow>[] = [
    'id',
    'customer',
    { key: 'amount', type: 'currency', sortable: true, align: 'end' },
    { key: 'status', type: 'badge', sortable: true },
    'plan',
  ];`,
    }),
  },
  {
    id: 'responsive-table',
    title: 'Audit log',
    description: 'Wide activity log with mixed fixed and flexible columns — horizontal scroll stays inside the table.',
    html: `<pui-table
  [data]="users"
  [columns]="columns"
  [toolbar]="false"
  [paginated]="false"
  [height]="340"
/>`,
    typescript: tsExample({
      selector: 'app-responsive-table-example',
      className: 'ResponsiveTableExampleComponent',
      imports: TABLE_IMPORT,
      types: USER_INTERFACE,
      body: `${USER_ROWS}

  readonly columns: PuiTableColumnInput<UserRow>[] = [
    { key: 'id', width: '80px' },
    'name',
    'email',
    { key: 'role', width: '140px' },
    'department',
    { key: 'status', type: 'badge' },
    { key: 'revenue', type: 'currency', align: 'end', width: '120px' },
    'lastActive',
  ];`,
    }),
  },
  {
    id: 'server-side-table',
    title: 'Server-side pagination',
    description: 'Fetch one page at a time with totalRows, loading state, and pageChange-driven refetch.',
    html: `<pui-table
  [data]="rows()"
  [columns]="columns"
  [loading]="loading()"
  [totalRows]="totalRows"
  [(pageIndex)]="pageIndex"
  [(pageSize)]="pageSize"
  (pageChange)="onPageChange($event)"
  [exportable]="false"
  [height]="400"
/>`,
    typescript: tsExample({
      selector: 'app-server-side-table-example',
      className: 'ServerSideTableExampleComponent',
      imports: TABLE_IMPORT,
      types: USER_INTERFACE,
      body: `  private readonly platformId = inject(PLATFORM_ID);

  readonly totalRows = 500;
  readonly pageIndex = model(0);
  readonly pageSize = model(25);
  readonly loading = signal(false);
  readonly rows = signal<UserRow[]>([]);

  readonly columns: PuiTableColumnInput<UserRow>[] = ['name', 'email', 'department', 'status', 'revenue'];

  constructor() {
    effect(() => {
      const page = this.pageIndex();
      const size = this.pageSize();
      this.fetchPage(page, size);
    });
  }

  private fetchPage(page: number, size: number): void {
    this.loading.set(true);
    const all = generateLargeUserDataset(this.totalRows);
    const slice = all.slice(page * size, (page + 1) * size);

    const commit = (): void => {
      this.rows.set(slice);
      this.loading.set(false);
    };

    if (isPlatformBrowser(this.platformId)) {
      window.setTimeout(commit, 350);
      return;
    }

    commit();
  }

  onPageChange(event: { pageIndex: number; pageSize: number }): void {
    console.log('Page changed', event);
  }`,
    }),
  },
  {
    id: 'export-formats-table',
    title: 'Limited export formats',
    description: 'Keep [exportable]="true" for the default menu, but restrict visible formats with exportFormats.',
    html: `<pui-table
  [data]="invoices"
  [columns]="columns"
  [exportable]="true"
  [exportFormats]="['csv', 'excel']"
  [height]="380"
/>`,
    typescript: tsExample({
      selector: 'app-export-formats-table-example',
      className: 'ExportFormatsTableExampleComponent',
      imports: TABLE_IMPORT,
      types: INVOICE_INTERFACE,
      body: `${INVOICE_ROWS}

  readonly columns: PuiTableColumnInput<InvoiceRow>[] = [
    'id',
    'customer',
    { key: 'amount', type: 'currency', align: 'end' },
    { key: 'status', type: 'badge' },
    'plan',
  ];`,
    }),
  },
  {
    id: 'custom-toolbar-table',
    title: 'Custom toolbar',
    description: 'Replace the default toolbar with puiTableToolbar and call table.export() from your own UI.',
    html: `<pui-table
  [data]="users"
  [columns]="columns"
  [exportable]="{ csv: true, excel: true, json: true, pdf: true }"
  [height]="380"
>
  <ng-template puiTableToolbar let-table>
    <div class="billing-toolbar">
      <pui-button size="sm" variant="outline" (click)="table.export('csv')">
        Export CSV
      </pui-button>
      <pui-button size="sm" variant="outline" (click)="table.export('excel')">
        Export Excel
      </pui-button>
      <pui-button size="sm" variant="ghost" (click)="table.clearSelection()">
        Clear selection
      </pui-button>
    </div>
  </ng-template>
</pui-table>`,
    typescript: tsExample({
      selector: 'app-custom-toolbar-table-example',
      className: 'CustomToolbarTableExampleComponent',
      imports: `${TABLE_IMPORT}
${BTN_IMPORT}`,
      types: USER_INTERFACE,
      body: `${USER_ROWS}

  readonly columns: PuiTableColumnInput<UserRow>[] = ['name', 'email', 'department', 'status', 'revenue'];`,
    }),
  },
  {
    id: 'row-actions-table',
    title: 'Row actions slot',
    description: 'Use puiTableRowActions to inject a sticky actions column without manual column config.',
    html: `<pui-table
  [data]="users"
  [columns]="columns"
  [toolbar]="false"
  [paginated]="false"
  [height]="360"
>
  <ng-template puiTableRowActions let-row let-index="index">
    <pui-button size="sm" variant="ghost" (click)="viewUser(row)">View</pui-button>
  </ng-template>
</pui-table>`,
    typescript: tsExample({
      selector: 'app-row-actions-table-example',
      className: 'RowActionsTableExampleComponent',
      imports: `${TABLE_IMPORT}
${BTN_IMPORT}`,
      types: USER_INTERFACE,
      body: `${USER_ROWS}

  readonly columns: PuiTableColumnInput<UserRow>[] = ['name', 'email', 'status', 'revenue'];

  viewUser(row: UserRow): void {
    console.log('View user', row.id);
  }`,
    }),
  },
  {
    id: 'table-api-ref',
    title: 'Template ref API',
    description: 'Access the same controller from the parent template using #usersTable="puiTable".',
    html: `<pui-table
  #usersTable="puiTable"
  [data]="users"
  [columns]="columns"
  [selectable]="true"
  [exportable]="true"
  [height]="380"
/>

<pui-button size="sm" variant="outline" (click)="usersTable.export('csv')">
  Export from parent
</pui-button>`,
    typescript: tsExample({
      selector: 'app-table-api-ref-example',
      className: 'TableApiRefExampleComponent',
      imports: `${TABLE_IMPORT}
${BTN_IMPORT}`,
      types: USER_INTERFACE,
      body: `${USER_ROWS}

  readonly columns: PuiTableColumnInput<UserRow>[] = ['name', 'email', 'department', 'status', 'revenue'];`,
    }),
  },
];

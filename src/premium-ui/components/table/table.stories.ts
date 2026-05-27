import type { Meta, StoryObj } from '@storybook/angular';
import { Component, signal } from '@angular/core';
import { PuiButtonComponent } from '../button';
import { PuiSwitchComponent } from '../switch';
import {
  PUI_TABLE_DEMO_INVOICES,
  PUI_TABLE_DEMO_USERS,
  PuiTableCellDefDirective,
  PuiTableComponent,
  generateLargeUserDataset,
} from './index';

const TABLE = [PuiTableComponent, PuiTableCellDefDirective, PuiButtonComponent, PuiSwitchComponent];

@Component({
  selector: 'story-table-simple',
  imports: TABLE,
  template: `
    <pui-table
      [data]="users"
      [columns]="columns"
      [toolbar]="false"
      [paginated]="false"
      [height]="360"
    />
  `,
})
class StoryTableSimpleComponent {
  protected readonly users = PUI_TABLE_DEMO_USERS;
  protected readonly columns = ['name', 'email', 'department', 'status', 'revenue'];
}

@Component({
  selector: 'story-table-enterprise',
  imports: TABLE,
  template: `
    <pui-table
      [data]="users"
      [columns]="columns"
      [selectable]="true"
      [searchable]="true"
      [exportable]="{ csv: true, excel: true, json: true }"
      [height]="480"
    />

    <ng-template puiTableCellDef="actions" let-row>
      <pui-button size="sm" variant="ghost">Edit</pui-button>
    </ng-template>
  `,
})
class StoryTableEnterpriseComponent {
  protected readonly users = PUI_TABLE_DEMO_USERS;
  protected readonly columns = [
    'name',
    { key: 'status', label: 'Status', type: 'badge' as const, sortable: true },
    { key: 'revenue', label: 'MRR', type: 'currency' as const, sortable: true, align: 'end' as const },
    { key: 'active', label: 'Active', type: 'custom' as const, exportable: false },
    { key: 'actions', label: '', type: 'custom' as const, sticky: 'right' as const, exportable: false },
  ];
}

@Component({
  selector: 'story-table-custom-switch',
  imports: TABLE,
  template: `
    <pui-table [data]="users" [columns]="columns" [toolbar]="{ search: true, export: false }" [height]="400" />

    <ng-template puiTableCellDef="active" let-row>
      <pui-switch [checked]="row.active" size="sm" ariaLabel="Toggle user active state" />
    </ng-template>
  `,
})
class StoryTableCustomSwitchComponent {
  protected readonly users = PUI_TABLE_DEMO_USERS.slice(0, 8);
  protected readonly columns = ['name', 'email', { key: 'active', label: 'Active', type: 'custom' as const, exportable: false }];
}

@Component({
  selector: 'story-table-virtual',
  imports: [PuiTableComponent],
  template: `
    <pui-table
      [data]="users()"
      [columns]="columns"
      [virtualScroll]="true"
      [useWorker]="true"
      [paginated]="false"
      [height]="520"
      tableId="story-virtual"
    />
  `,
})
class StoryTableVirtualComponent {
  protected readonly users = signal(generateLargeUserDataset(10000));
  protected readonly columns = ['name', 'email', 'department', 'status', 'revenue'];
}

@Component({
  selector: 'story-table-invoices',
  imports: [PuiTableComponent],
  template: `
    <pui-table
      [data]="invoices"
      [columns]="columns"
      [searchable]="true"
      [exportable]="{ csv: true, json: true }"
      [height]="420"
    />
  `,
})
class StoryTableInvoicesComponent {
  protected readonly invoices = PUI_TABLE_DEMO_INVOICES;
  protected readonly columns = [
    'id',
    'customer',
    { key: 'amount', type: 'currency' as const, sortable: true, align: 'end' as const },
    { key: 'status', type: 'badge' as const, sortable: true },
    'plan',
    'issued',
  ];
}

const meta: Meta = {
  title: 'Data Display/Table',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const Simple: Story = {
  render: () => ({ moduleMetadata: { imports: [StoryTableSimpleComponent] }, template: '<story-table-simple />' }),
};

export const Enterprise: Story = {
  render: () => ({ moduleMetadata: { imports: [StoryTableEnterpriseComponent] }, template: '<story-table-enterprise />' }),
};

export const CustomSwitchColumn: Story = {
  render: () => ({ moduleMetadata: { imports: [StoryTableCustomSwitchComponent] }, template: '<story-table-custom-switch />' }),
};

export const Invoices: Story = {
  render: () => ({ moduleMetadata: { imports: [StoryTableInvoicesComponent] }, template: '<story-table-invoices />' }),
};

export const Virtualized: Story = {
  render: () => ({ moduleMetadata: { imports: [StoryTableVirtualComponent] }, template: '<story-table-virtual />' }),
};

export const Playground: Story = {
  render: () => ({ moduleMetadata: { imports: [StoryTableEnterpriseComponent] }, template: '<story-table-enterprise />' }),
};

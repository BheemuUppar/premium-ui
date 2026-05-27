export interface PuiTableUserRow {
  readonly id: number;
  readonly name: string;
  readonly email: string;
  readonly role: string;
  readonly status: 'Active' | 'Inactive' | 'Pending';
  readonly revenue: number;
  readonly lastActive: string;
  readonly department: string;
  readonly active: boolean;
}

export interface PuiTableInvoiceRow {
  readonly id: string;
  readonly customer: string;
  readonly amount: number;
  readonly status: 'Paid' | 'Pending' | 'Overdue';
  readonly issued: string;
  readonly plan: string;
}

export interface PuiTableSubscriptionRow {
  readonly id: string;
  readonly account: string;
  readonly plan: 'Starter' | 'Pro' | 'Enterprise';
  readonly mrr: number;
  readonly status: 'Active' | 'Trialing' | 'Cancelled';
  readonly renews: string;
}

export interface PuiTableTicketRow {
  readonly id: string;
  readonly subject: string;
  readonly priority: 'Low' | 'Medium' | 'High';
  readonly status: 'Open' | 'In progress' | 'Resolved';
  readonly assignee: string;
  readonly updated: string;
}

export const PUI_TABLE_DEMO_USERS: readonly PuiTableUserRow[] = [
  { id: 1, name: 'Sarah Chen', email: 'sarah.chen@linear.app', role: 'Engineering', status: 'Active', revenue: 84200, lastActive: '2026-05-22', department: 'Platform', active: true },
  { id: 2, name: 'Marcus Johnson', email: 'marcus.j@notion.so', role: 'Design', status: 'Active', revenue: 61500, lastActive: '2026-05-21', department: 'Product', active: true },
  { id: 3, name: 'Elena Rodriguez', email: 'elena.r@airtable.com', role: 'Product', status: 'Pending', revenue: 92800, lastActive: '2026-05-20', department: 'Growth', active: false },
  { id: 4, name: 'James Okonkwo', email: 'james.o@stripe.com', role: 'Sales', status: 'Active', revenue: 120400, lastActive: '2026-05-23', department: 'Revenue', active: true },
  { id: 5, name: 'Aisha Patel', email: 'aisha.p@figma.com', role: 'Support', status: 'Inactive', revenue: 45200, lastActive: '2026-05-10', department: 'Success', active: false },
  { id: 6, name: 'Tomás Rivera', email: 'tomas.r@vercel.com', role: 'Engineering', status: 'Active', revenue: 77300, lastActive: '2026-05-22', department: 'Infrastructure', active: true },
  { id: 7, name: 'Yuki Tanaka', email: 'yuki.t@slack.com', role: 'Marketing', status: 'Active', revenue: 58900, lastActive: '2026-05-19', department: 'Brand', active: true },
  { id: 8, name: 'Olivia Berg', email: 'olivia.b@spotify.com', role: 'Analytics', status: 'Active', revenue: 103600, lastActive: '2026-05-23', department: 'Data', active: true },
  { id: 9, name: 'Daniel Kim', email: 'daniel.k@discord.com', role: 'Engineering', status: 'Pending', revenue: 68100, lastActive: '2026-05-18', department: 'Platform', active: false },
  { id: 10, name: 'Fatima Al-Hassan', email: 'fatima.a@shopify.com', role: 'Operations', status: 'Active', revenue: 88700, lastActive: '2026-05-21', department: 'Ops', active: true },
  { id: 11, name: 'Liam O\'Connor', email: 'liam.o@hubspot.com', role: 'Sales', status: 'Active', revenue: 95600, lastActive: '2026-05-22', department: 'Revenue', active: true },
  { id: 12, name: 'Sophie Laurent', email: 'sophie.l@atlassian.com', role: 'Design', status: 'Inactive', revenue: 52300, lastActive: '2026-05-08', department: 'Product', active: false },
];

export const PUI_TABLE_DEMO_INVOICES: readonly PuiTableInvoiceRow[] = [
  { id: 'INV-2401', customer: 'Acme Corp', amount: 12400, status: 'Paid', issued: '2026-05-01', plan: 'Enterprise' },
  { id: 'INV-2402', customer: 'Northwind Labs', amount: 4200, status: 'Pending', issued: '2026-05-08', plan: 'Pro' },
  { id: 'INV-2403', customer: 'Globex', amount: 8900, status: 'Overdue', issued: '2026-04-15', plan: 'Pro' },
  { id: 'INV-2404', customer: 'Umbrella Inc', amount: 5600, status: 'Paid', issued: '2026-05-12', plan: 'Starter' },
  { id: 'INV-2405', customer: 'Initech', amount: 15200, status: 'Pending', issued: '2026-05-18', plan: 'Enterprise' },
];

export const PUI_TABLE_DEMO_SUBSCRIPTIONS: readonly PuiTableSubscriptionRow[] = [
  { id: 'SUB-901', account: 'Linear Workspace', plan: 'Enterprise', mrr: 2400, status: 'Active', renews: '2026-06-01' },
  { id: 'SUB-902', account: 'Notion Team', plan: 'Pro', mrr: 890, status: 'Active', renews: '2026-06-14' },
  { id: 'SUB-903', account: 'Airtable Base', plan: 'Pro', mrr: 650, status: 'Trialing', renews: '2026-05-30' },
  { id: 'SUB-904', account: 'Vercel Org', plan: 'Enterprise', mrr: 3200, status: 'Active', renews: '2026-06-20' },
  { id: 'SUB-905', account: 'Side Project', plan: 'Starter', mrr: 29, status: 'Cancelled', renews: '—' },
];

export const PUI_TABLE_DEMO_TICKETS: readonly PuiTableTicketRow[] = [
  { id: 'TCK-4412', subject: 'SSO login failing for Okta', priority: 'High', status: 'In progress', assignee: 'Sarah Chen', updated: '2026-05-23' },
  { id: 'TCK-4413', subject: 'Export timeout on large datasets', priority: 'Medium', status: 'Open', assignee: 'Marcus Johnson', updated: '2026-05-22' },
  { id: 'TCK-4414', subject: 'Billing address update', priority: 'Low', status: 'Resolved', assignee: 'Aisha Patel', updated: '2026-05-21' },
  { id: 'TCK-4415', subject: 'Webhook retries not firing', priority: 'High', status: 'Open', assignee: 'Tomás Rivera', updated: '2026-05-23' },
];

export function generateLargeUserDataset(count = 10000): PuiTableUserRow[] {
  const departments = ['Platform', 'Product', 'Growth', 'Revenue', 'Success', 'Data', 'Ops'];
  const roles = ['Engineering', 'Design', 'Product', 'Sales', 'Support', 'Marketing', 'Analytics', 'Operations'];
  const statuses: PuiTableUserRow['status'][] = ['Active', 'Inactive', 'Pending'];

  return Array.from({ length: count }, (_, index) => {
    const id = index + 1;
    const status = statuses[index % statuses.length]!;
    return {
      id,
      name: `User ${id}`,
      email: `user${id}@company.com`,
      role: roles[index % roles.length]!,
      status,
      revenue: 30000 + ((index * 7919) % 120000),
      lastActive: `2026-0${(index % 5) + 1}-${String((index % 28) + 1).padStart(2, '0')}`,
      department: departments[index % departments.length]!,
      active: status === 'Active',
    };
  });
}

export function generateInvoiceDataset(count = 120): PuiTableInvoiceRow[] {
  const statuses: PuiTableInvoiceRow['status'][] = ['Paid', 'Pending', 'Overdue'];
  const plans = ['Starter', 'Pro', 'Enterprise'];
  const customers = ['Acme Corp', 'Globex', 'Initech', 'Umbrella Inc', 'Northwind Labs', 'Stark Industries'];

  return Array.from({ length: count }, (_, index) => ({
    id: `INV-${2400 + index}`,
    customer: customers[index % customers.length]!,
    amount: 1200 + ((index * 437) % 18000),
    status: statuses[index % statuses.length]!,
    issued: `2026-0${(index % 5) + 1}-${String((index % 28) + 1).padStart(2, '0')}`,
    plan: plans[index % plans.length]!,
  }));
}

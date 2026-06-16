import type { PuiCommand } from '../registry/command.types';

export const DEMO_NAVIGATION_COMMANDS: readonly PuiCommand[] = [
  {
    id: 'nav-dashboard',
    label: 'Dashboard',
    description: 'Go to the main dashboard',
    group: 'Navigation',
    icon: 'layout-dashboard',
    keywords: ['home', 'overview'],
    shortcut: '⌘D',
    action: () => undefined,
  },
  {
    id: 'nav-users',
    label: 'Users',
    description: 'Manage team members',
    group: 'Navigation',
    icon: 'users',
    keywords: ['team', 'members'],
    shortcut: '⌘U',
    action: () => undefined,
  },
  {
    id: 'nav-billing',
    label: 'Billing',
    description: 'Plans and invoices',
    group: 'Navigation',
    icon: 'credit-card',
    keywords: ['payment', 'subscription'],
    action: () => undefined,
  },
];

export const DEMO_ACTION_COMMANDS: readonly PuiCommand[] = [
  {
    id: 'action-create-user',
    label: 'Create User',
    description: 'Open the new user dialog',
    group: 'Actions',
    icon: 'user-plus',
    keywords: ['add', 'invite'],
    action: () => undefined,
  },
  {
    id: 'action-invite-member',
    label: 'Invite Member',
    description: 'Send an email invitation',
    group: 'Actions',
    icon: 'mail-plus',
    action: () => undefined,
  },
  {
    id: 'action-export',
    label: 'Export Data',
    description: 'Download the current table as CSV',
    group: 'Actions',
    icon: 'download',
    action: () => undefined,
  },
  {
    id: 'action-refresh',
    label: 'Refresh Table',
    description: 'Reload the latest rows',
    group: 'Actions',
    icon: 'refresh-cw',
    action: () => undefined,
  },
];

export const DEMO_COMMANDS: readonly PuiCommand[] = [
  ...DEMO_NAVIGATION_COMMANDS,
  ...DEMO_ACTION_COMMANDS,
  {
    id: 'settings',
    label: 'Settings',
    description: 'Workspace preferences',
    group: 'Actions',
    icon: 'settings',
    shortcut: '⌘,',
    action: () => undefined,
  },
];

export function createRouteCommands(navigate: (path: string) => void): readonly PuiCommand[] {
  return DEMO_NAVIGATION_COMMANDS.map((command) => ({
    ...command,
    action: () => {
      const routes: Record<string, string> = {
        'nav-dashboard': '/dashboard',
        'nav-users': '/users',
        'nav-billing': '/billing',
      };
      navigate(routes[command.id] ?? '/');
    },
  }));
}

import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  inject,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { map } from 'rxjs';
import { PuiButtonComponent } from '../../../../premium-ui/components/button';
import {
  PuiCommandItemTemplateDirective,
  PuiCommandPaletteService,
  type PuiCommand,
} from '../../../../premium-ui/command';
import type { PuiDocApiRow, PuiDocA11yItem, PuiDocCodeTab, PuiDocsTab } from '../../docs.types';
import {
  PuiDocApiTableComponent,
  PuiDocA11yListComponent,
  PuiDocExampleComponent,
  PuiDocRelatedLinksComponent,
  buildPlaygroundExampleTabs,
  buildServiceExampleTabs,
  buildThemeTabs,
  buildHtmlTsTabs,
} from '../../shared';
import { useDocsPageSeo } from '../../seo/use-docs-page-seo';
import { getRelatedLinks } from '../../seo/docs-seo.service';

type PuiDocsCommandTab =
  | 'overview'
  | 'examples'
  | 'api'
  | 'accessibility'
  | 'theming'
  | 'playground';

const COMMAND_SERVICE = { name: 'PuiCommandService', path: '@premium-ui/command' } as const;
const PALETTE_SERVICE = { name: 'PuiCommandPaletteService', path: '@premium-ui/command' } as const;
const REGISTRY_SERVICE = { name: 'PuiCommandRegistry', path: '@premium-ui/command' } as const;
const BUTTON_IMPORT = {
  name: 'PuiButtonComponent',
  path: '@premium-ui/components/button',
} as const;

@Component({
  selector: 'app-command-docs',
  imports: [
    PuiButtonComponent,
    PuiCommandItemTemplateDirective,
    PuiDocApiTableComponent,
    PuiDocA11yListComponent,
    PuiDocExampleComponent,
    PuiDocRelatedLinksComponent,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './command-docs.component.html',
  styleUrl: './command-docs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandDocsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly palette = inject(PuiCommandPaletteService);
  private readonly customTemplate = viewChild(PuiCommandItemTemplateDirective);

  private readonly routeTab = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('tab') ?? 'overview')),
    { initialValue: 'overview' }
  );

  protected readonly currentTab = this.routeTab;

  protected readonly tabs: readonly PuiDocsTab[] = [
    { label: 'Overview', route: ['/docs/components/command/overview'] },
    { label: 'Examples', route: ['/docs/components/command/examples'] },
    { label: 'API', route: ['/docs/components/command/api'] },
    { label: 'Accessibility', route: ['/docs/components/command/accessibility'] },
    { label: 'Theming', route: ['/docs/components/command/theming'] },
    { label: 'Playground', route: ['/docs/components/command/playground'] },
  ];

  protected readonly relatedLinks = getRelatedLinks('command');

  protected readonly registryApiRows: readonly PuiDocApiRow[] = [
    { name: 'register(command)', type: 'void', defaultValue: '—', description: 'Register or replace a command by id.' },
    { name: 'registerMany(commands)', type: 'void', defaultValue: '—', description: 'Bulk register commands.' },
    { name: 'unregister(id)', type: 'boolean', defaultValue: '—', description: 'Remove a command. Returns true when removed.' },
    { name: 'clear()', type: 'void', defaultValue: '—', description: 'Remove all registered commands.' },
    { name: 'getCommands()', type: 'PuiCommand[]', defaultValue: '—', description: 'Snapshot of all commands.' },
    { name: 'commands', type: 'Signal<PuiCommand[]>', defaultValue: '—', description: 'Reactive signal of registered commands.' },
  ];

  protected readonly paletteApiRows: readonly PuiDocApiRow[] = [
    { name: 'open(config?)', type: 'void', defaultValue: '—', description: 'Open the palette overlay. Supports animation (macos | smooth | minimal) and positionAtCursor.' },
    { name: 'close()', type: 'void', defaultValue: '—', description: 'Close the palette and restore focus.' },
    { name: 'toggle(config?)', type: 'void', defaultValue: '—', description: 'Open or close the palette.' },
    { name: 'isOpen', type: 'Signal<boolean>', defaultValue: 'false', description: 'True while the palette overlay is visible.' },
    { name: 'registerShortcuts(shortcuts?)', type: 'void', defaultValue: "['meta+k','ctrl+k']", description: 'Register global keyboard shortcuts.' },
  ];

  protected readonly commandApiRows: readonly PuiDocApiRow[] = [
    { name: 'register(command)', type: 'void', defaultValue: '—', description: 'Facade over the registry.' },
    { name: 'search(options?)', type: 'PuiCommandSearchResponse', defaultValue: '—', description: 'Synchronous search for instant palette feedback.' },
    { name: 'searchAsync(options?)', type: 'Promise<PuiCommandSearchResponse>', defaultValue: '—', description: 'Optional worker-backed search for large registries.' },
    { name: 'execute(id)', type: 'Promise<PuiCommandExecuteResult>', defaultValue: '—', description: 'Run a command action safely. Records recents on success.' },
    { name: 'resolveGroupedCommands(options?)', type: 'PuiCommandGroup[]', defaultValue: '—', description: 'Grouped + optional recent commands for UI.' },
  ];

  protected readonly a11yItems: readonly PuiDocA11yItem[] = [
    { title: 'Dialog semantics', description: 'Palette uses role="dialog" with aria-modal="true".' },
    { title: 'Listbox options', description: 'Items expose role="option" with aria-selected state.' },
    { title: 'Combobox input', description: 'Search field uses role="combobox" wired to the listbox.' },
    { title: 'Keyboard', description: 'Arrow keys, Enter, Escape, Home, End, and Tab trapping.' },
    { title: 'Focus restore', description: 'Focus returns to the trigger element on close.' },
  ];

  protected readonly basicExampleTabs: readonly PuiDocCodeTab[] = buildServiceExampleTabs({
    html: `<pui-button (click)="open()">Open command palette</pui-button>`,
    selector: 'app-command-open-demo',
    componentClass: 'CommandOpenDemoComponent',
    componentImports: [BUTTON_IMPORT],
    services: [PALETTE_SERVICE],
    methods: ['open(): void { this.commandpaletteservice.open(); }'],
  });

  protected readonly registerExampleTabs: readonly PuiDocCodeTab[] = buildServiceExampleTabs({
    html: `<!-- Commands are registered in TypeScript -->`,
    selector: 'app-command-register-demo',
    componentClass: 'CommandRegisterDemoComponent',
    componentImports: [],
    services: [REGISTRY_SERVICE, { name: 'Router', path: '@angular/router' }],
    methods: [
      `ngOnInit(): void {
    this.commandregistry.registerMany([
      { id: 'nav-dashboard', label: 'Dashboard', group: 'Navigation', action: () => this.router.navigate(['/dashboard']) },
    ]);
  }`,
    ],
  });

  protected readonly shortcutExampleTabs: readonly PuiDocCodeTab[] = buildHtmlTsTabs(
    `<body [puiCommandPaletteShortcut]="['meta+k', 'ctrl+k']">
  <router-outlet />
</body>`,
    {
      selector: 'app-root',
      componentClass: 'AppComponent',
      imports: [
        { name: 'RouterOutlet', path: '@angular/router' },
        { name: 'PuiCommandPaletteShortcutDirective', path: '@premium-ui/command' },
      ],
      templateUrl: './app.component.html',
    }
  );

  protected readonly templateExampleTabs: readonly PuiDocCodeTab[] = buildServiceExampleTabs({
    html: `<ng-template puiCommandItem let-command>
  <strong>{{ command.label }}</strong>
  <span>{{ command.description }}</span>
</ng-template>

<pui-button (click)="openWithTemplate()">Open palette</pui-button>`,
    selector: 'app-command-template-demo',
    componentClass: 'CommandTemplateDemoComponent',
    componentImports: [BUTTON_IMPORT, { name: 'PuiCommandItemTemplateDirective', path: '@premium-ui/command' }],
    services: [PALETTE_SERVICE],
    methods: [
      `openWithTemplate(): void {
    this.commandpaletteservice.open({ itemTemplate: this.item()?.templateRef });
  }`,
    ],
  });

  protected readonly themeTabs = buildThemeTabs(`:root {
  --pui-command-palette-radius: var(--pui-radius-lg);
  --pui-command-palette-surface: var(--pui-color-surface-elevated, var(--pui-color-surface));
  --pui-command-palette-shadow: var(--pui-shadow-lg);
  --pui-command-palette-active-bg: color-mix(in srgb, var(--pui-color-primary) 12%, transparent);
  --pui-command-palette-border: var(--pui-color-border);
}`);

  protected readonly playgroundTabs = buildPlaygroundExampleTabs({
    html: '<pui-button (click)="open()">Open palette</pui-button>',
    componentClass: 'CommandPlaygroundComponent',
    componentImports: [BUTTON_IMPORT],
    services: [PALETTE_SERVICE],
    members: [
      'private readonly palette = inject(PuiCommandPaletteService);',
      'open(): void { this.palette.open(); }',
    ],
  });

  constructor() {
    useDocsPageSeo({ slug: 'command', tab: this.currentTab });
  }

  protected openPalette(): void {
    this.palette.open({ animation: 'macos', positionAtCursor: true });
  }

  protected openSmoothPalette(): void {
    this.palette.open({ animation: 'smooth', positionAtCursor: true });
  }

  protected openMinimalPalette(): void {
    this.palette.open({ animation: 'minimal', positionAtCursor: true });
  }

  protected openCustomTemplatePalette(): void {
    const template = this.customTemplate()?.templateRef as TemplateRef<{ $implicit: PuiCommand }> | undefined;
    this.palette.open({ itemTemplate: template, animation: 'macos', positionAtCursor: true });
  }
}

import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { map } from 'rxjs';
import { PuiButtonComponent } from '../../../../premium-ui/components/button';
import { PuiCheckboxComponent } from '../../../../premium-ui/components/checkbox';
import { PuiSelectComponent } from '../../../../premium-ui/components/select';
import type { PuiSelectValue } from '../../../../premium-ui/components/select';
import {
  PUI_TOAST_POSITIONS,
  PuiToastService,
  type PuiToastPosition,
  type PuiToastVariant,
} from '../../../../premium-ui/components/toast';
import type { PuiDocApiRow, PuiDocA11yItem, PuiDocCodeTab, PuiDocsTab } from '../../docs.types';
import {
  PuiDocApiTableComponent,
  PuiDocA11yListComponent,
  PuiDocExampleComponent,
  PuiDocRelatedLinksComponent,
  buildAppShellTabs,
  buildPlaygroundExampleTabs,
  buildServiceExampleTabs,
  buildThemeTabs,
  toSelectOptions,
} from '../../shared';
import { useDocsPageSeo } from '../../seo/use-docs-page-seo';
import { getRelatedLinks } from '../../seo/docs-seo.service';

type PuiDocsToastTab =
  | 'overview'
  | 'examples'
  | 'api'
  | 'accessibility'
  | 'theming'
  | 'playground';

const TOAST_SERVICE = {
  name: 'PuiToastService',
  path: '@premium-ui/components/toast',
} as const;

const BUTTON_IMPORT = {
  name: 'PuiButtonComponent',
  path: '@premium-ui/components/button',
} as const;

const VIEWPORT_IMPORT = {
  name: 'PuiToastViewportComponent',
  path: '@premium-ui/components/toast',
} as const;

const ROUTER_IMPORT = {
  name: 'RouterOutlet',
  path: '@angular/router',
} as const;

@Component({
  selector: 'app-toast-docs',
  imports: [
    PuiButtonComponent,
    PuiSelectComponent,
    PuiCheckboxComponent,
    PuiDocApiTableComponent,
    PuiDocA11yListComponent,
    PuiDocExampleComponent,
    PuiDocRelatedLinksComponent,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './toast-docs.component.html',
  styleUrl: './toast-docs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastDocsComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly toast = inject(PuiToastService);

  private readonly routeTab = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('tab') ?? 'overview')),
    { initialValue: 'overview' }
  );

  protected readonly currentTab = computed<PuiDocsToastTab>(() => {
    const tab = this.routeTab();
    return this.isDocsTab(tab) ? tab : 'overview';
  });

  protected readonly tabs: readonly PuiDocsTab[] = [
    { label: 'Overview', route: ['/docs/components/toast/overview'] },
    { label: 'Examples', route: ['/docs/components/toast/examples'] },
    { label: 'API Guide', route: ['/docs/components/toast/api'] },
    { label: 'Accessibility', route: ['/docs/components/toast/accessibility'] },
    { label: 'Theming', route: ['/docs/components/toast/theming'] },
    { label: 'Playground', route: ['/docs/components/toast/playground'] },
  ];

  constructor() {
    useDocsPageSeo({ slug: 'toast', tab: this.currentTab });
  }

  protected readonly relatedLinks = getRelatedLinks('toast');

  protected readonly positions = PUI_TOAST_POSITIONS;
  protected readonly positionOptions = toSelectOptions([...this.positions]);
  protected readonly variantOptions = toSelectOptions([
    'default',
    'success',
    'error',
    'warning',
    'info',
    'loading',
    'snackbar',
    'compact',
    'rich',
  ] as const);

  protected readonly durationOptions = toSelectOptions(['2500', '4000', '5000', '8000'] as const);

  protected readonly basicExampleTabs = buildServiceExampleTabs({
    html: `<pui-button (click)="save()">Save changes</pui-button>`,
    selector: 'app-save-demo',
    componentClass: 'SaveDemoComponent',
    componentImports: [BUTTON_IMPORT],
    services: [TOAST_SERVICE],
    methods: [
      'save(): void {',
      "  this.toast.success('Changes saved successfully');",
      '}',
    ],
    htmlFilename: 'save-demo.component.html',
    tsFilename: 'save-demo.component.ts',
  });

  protected readonly viewportExampleTabs = buildAppShellTabs({
    html: `<router-outlet />
<pui-toast-viewport />`,
    imports: [ROUTER_IMPORT, VIEWPORT_IMPORT],
  });

  protected readonly objectApiExampleTabs = buildServiceExampleTabs({
    html: `<pui-button (click)="notify()">Notify with rich payload</pui-button>`,
    selector: 'app-toast-object-demo',
    componentClass: 'ToastObjectDemoComponent',
    componentImports: [BUTTON_IMPORT],
    services: [TOAST_SERVICE],
    methods: [
      'notify(): void {',
      '  this.toast.success({',
      "    title: 'Saved',",
      "    description: 'Your changes were saved.',",
      "    actionLabel: 'Undo',",
      '    onAction: () => this.undo(),',
      '    duration: 5000,',
      "    position: 'top-right',",
      '  });',
      '}',
      '',
      'private undo(): void {',
      '  // restore previous state',
      '}',
    ],
    htmlFilename: 'toast-object-demo.component.html',
    tsFilename: 'toast-object-demo.component.ts',
  });

  protected readonly semanticExampleTabs = buildServiceExampleTabs({
    html: `<div class="toast-demo-row">
  <pui-button (click)="showSuccess()">Success</pui-button>
  <pui-button variant="danger" (click)="showError()">Error</pui-button>
  <pui-button variant="outline" (click)="showWarning()">Warning</pui-button>
  <pui-button variant="ghost" (click)="showInfo()">Info</pui-button>
</div>`,
    selector: 'app-toast-semantic-demo',
    componentClass: 'ToastSemanticDemoComponent',
    componentImports: [BUTTON_IMPORT],
    services: [TOAST_SERVICE],
    methods: [
      "showSuccess(): void { this.toast.success('Changes saved'); }",
      "showError(): void { this.toast.error('Unable to save changes'); }",
      "showWarning(): void { this.toast.warning('Check your input'); }",
      "showInfo(): void { this.toast.info('New version available'); }",
    ],
    htmlFilename: 'toast-semantic-demo.component.html',
    tsFilename: 'toast-semantic-demo.component.ts',
  });

  protected readonly iconExampleTabs = buildServiceExampleTabs({
    html: `<div class="toast-demo-row">
  <pui-button variant="outline" (click)="showDefaultIcon()">Default icon</pui-button>
  <pui-button variant="outline" (click)="showCustomIcon()">Custom icon</pui-button>
  <pui-button variant="ghost" (click)="showIconless()">Iconless</pui-button>
</div>`,
    selector: 'app-toast-icon-demo',
    componentClass: 'ToastIconDemoComponent',
    componentImports: [BUTTON_IMPORT],
    services: [TOAST_SERVICE],
    methods: [
      "showDefaultIcon(): void { this.toast.success('Saved'); }",
      "showCustomIcon(): void { this.toast.info('Reminder set', { iconName: 'bell' }); }",
      "showIconless(): void { this.toast.success('Copied', { icon: false }); }",
    ],
    htmlFilename: 'toast-icon-demo.component.html',
    tsFilename: 'toast-icon-demo.component.ts',
  });

  protected readonly snackbarExampleTabs = buildServiceExampleTabs({
    html: `<pui-button variant="secondary" (click)="deleteFile()">Delete file</pui-button>`,
    selector: 'app-toast-snackbar-demo',
    componentClass: 'ToastSnackbarDemoComponent',
    componentImports: [BUTTON_IMPORT],
    services: [TOAST_SERVICE],
    methods: [
      'deleteFile(): void {',
      "  this.toast.snackbar('File deleted', {",
      "    actionLabel: 'Undo',",
      '    onAction: () => this.restoreFile(),',
      '  });',
      '}',
      '',
      'private restoreFile(): void {',
      '  // restore file from trash',
      '}',
    ],
    htmlFilename: 'toast-snackbar-demo.component.html',
    tsFilename: 'toast-snackbar-demo.component.ts',
  });

  protected readonly richExampleTabs = buildServiceExampleTabs({
    html: `<pui-button (click)="showDeployment()">Show rich toast</pui-button>`,
    selector: 'app-toast-rich-demo',
    componentClass: 'ToastRichDemoComponent',
    componentImports: [BUTTON_IMPORT],
    services: [TOAST_SERVICE],
    methods: [
      'showDeployment(): void {',
      '  this.toast.rich({',
      "    title: 'Deployment complete',",
      "    description: 'Your app is now live on production.',",
      "    actionLabel: 'View deployment',",
      '    onAction: () => this.openDeploy(),',
      '  });',
      '}',
      '',
      'private openDeploy(): void {',
      '  // navigate to deployment dashboard',
      '}',
    ],
    htmlFilename: 'toast-rich-demo.component.html',
    tsFilename: 'toast-rich-demo.component.ts',
  });

  protected readonly promiseExampleTabs = buildServiceExampleTabs({
    html: `<pui-button variant="outline" (click)="upload()">Upload file</pui-button>`,
    selector: 'app-toast-promise-demo',
    componentClass: 'ToastPromiseDemoComponent',
    componentImports: [BUTTON_IMPORT],
    services: [TOAST_SERVICE],
    methods: [
      'upload(): void {',
      '  void this.toast.promise(this.uploadFile(), {',
      "    loading: 'Uploading file…',",
      "    success: 'Upload complete',",
      "    error: 'Upload failed',",
      '  });',
      '}',
      '',
      'private uploadFile(): Promise<void> {',
      '  return new Promise((resolve) => window.setTimeout(resolve, 1500));',
      '}',
    ],
    htmlFilename: 'toast-promise-demo.component.html',
    tsFilename: 'toast-promise-demo.component.ts',
  });

  protected readonly loadingExampleTabs = buildServiceExampleTabs({
    html: `<pui-button variant="outline" (click)="process()">Process with update</pui-button>`,
    selector: 'app-toast-loading-demo',
    componentClass: 'ToastLoadingDemoComponent',
    componentImports: [BUTTON_IMPORT],
    services: [TOAST_SERVICE],
    methods: [
      'process(): void {',
      "  const id = this.toast.loading('Processing…');",
      '  window.setTimeout(() => {',
      "    this.toast.success('Done', { id });",
      '  }, 1400);',
      '}',
    ],
    htmlFilename: 'toast-loading-demo.component.html',
    tsFilename: 'toast-loading-demo.component.ts',
  });

  protected readonly methodRows: readonly PuiDocApiRow[] = [
    {
      name: 'show(message, options?)',
      type: 'PuiToastMessage',
      defaultValue: '-',
      description: 'Show a neutral toast. Accepts a string or object payload.',
    },
    {
      name: 'success / error / warning / info',
      type: 'PuiToastMessage',
      defaultValue: '-',
      description: 'Semantic shortcuts with Lucide-aligned icons and tinted surfaces.',
    },
    {
      name: 'loading(message, options?)',
      type: 'PuiToastMessage',
      defaultValue: '-',
      description: 'Persistent toast with spinner until updated or dismissed.',
    },
    {
      name: 'snackbar(message, options?)',
      type: 'PuiToastMessage',
      defaultValue: '-',
      description: 'Compact horizontal layout — defaults to bottom-center.',
    },
    {
      name: 'compact(message, options?)',
      type: 'PuiToastMessage',
      defaultValue: '-',
      description: 'Minimal feedback for low-attention confirmations.',
    },
    {
      name: 'rich(message, options?)',
      type: 'PuiToastMessage',
      defaultValue: '-',
      description: 'Title + description + optional action for SaaS workflows.',
    },
    {
      name: 'update(id, options)',
      type: 'PuiToastOptions',
      defaultValue: '-',
      description: 'Transition an existing toast — ideal for loading → success/error.',
    },
    {
      name: 'dismiss(id?)',
      type: 'void',
      defaultValue: '-',
      description: 'Dismiss one toast by id, or all when id is omitted.',
    },
    {
      name: 'promise(promise, messages, options?)',
      type: 'Promise<T>',
      defaultValue: '-',
      description: 'Loading toast that resolves to success or error automatically.',
    },
  ];

  protected readonly optionRows: readonly PuiDocApiRow[] = [
    { name: 'title', type: 'string', defaultValue: '-', description: 'Primary message — required in object payloads.' },
    { name: 'description', type: 'string', defaultValue: '-', description: 'Supporting copy for rich toasts.' },
    { name: 'actionLabel / onAction', type: 'string / () => void', defaultValue: '-', description: 'Shorthand for a single action button.' },
    { name: 'action', type: 'PuiToastAction', defaultValue: '-', description: 'Full action config with label, handler, and optional ariaLabel.' },
    { name: 'variant', type: 'PuiToastVariant', defaultValue: 'default', description: 'Visual style including snackbar and compact modes.' },
    { name: 'position', type: 'PuiToastPosition', defaultValue: 'bottom-right', description: 'Viewport anchor — snackbar defaults to bottom-center.' },
    { name: 'duration', type: 'number | null', defaultValue: '4000', description: 'Auto-dismiss in ms. null keeps the toast open (loading).' },
    { name: 'dismissible', type: 'boolean', defaultValue: 'true', description: 'Show close button. Loading defaults to false.' },
    { name: 'icon', type: 'boolean', defaultValue: 'variant', description: 'Force icon on/off. false hides the icon entirely.' },
    { name: 'iconName', type: 'PuiToastIconName | null', defaultValue: 'semantic', description: 'Override semantic icon — circle-check, circle-alert, triangle-alert, info, loader-circle, bell.' },
    { name: 'className', type: 'string', defaultValue: '-', description: 'Additional host class for one-off styling.' },
    { name: 'ariaLive', type: 'polite | assertive', defaultValue: 'variant', description: 'Screen reader politeness — error/warning default to assertive.' },
    { name: 'id', type: 'string', defaultValue: 'auto', description: 'Stable id for updates and dismissal.' },
  ];

  protected readonly inputRows: readonly PuiDocApiRow[] = [
    { name: 'PuiToastInput', type: 'object', defaultValue: '-', description: 'Ergonomic object payload with title, description, actionLabel, icon, duration, position.' },
    { name: 'PuiToastMessage', type: 'string | PuiToastInput', defaultValue: '-', description: 'Every toast method accepts either a string or structured object.' },
  ];

  protected readonly a11yItems: readonly PuiDocA11yItem[] = [
    {
      title: 'Live regions',
      code: 'role="status" + aria-live',
      description: 'Each toast exposes polite or assertive live regions based on severity. Icons are decorative and hidden from assistive tech.',
    },
    {
      title: 'Keyboard actions',
      code: 'Enter / Space',
      description: 'Action and dismiss buttons are native controls with visible focus rings and keyboard activation.',
    },
    {
      title: 'Pause on hover',
      code: 'timer pause',
      description: 'Auto-dismiss timers pause while the pointer or focus is inside the toast surface.',
    },
    {
      title: 'Reduced motion',
      code: 'prefers-reduced-motion',
      description: 'Entry, exit, and stack transitions respect reduced motion preferences.',
    },
  ];

  protected readonly themeTabs = buildThemeTabs(`:root {
  --pui-toast-radius: calc(var(--pui-radius-lg) + var(--pui-space-xxs));
  --pui-toast-shadow: var(--pui-shadow-lg);
  --pui-toast-success-accent: var(--pui-color-success);
  --pui-toast-error-accent: var(--pui-color-danger);
  --pui-toast-warning-accent: var(--pui-color-warning);
  --pui-toast-info-accent: var(--pui-color-primary);
}

/* Subtle semantic tinting is applied via --pui-toast-*-bg on each variant */`);

  protected readonly playgroundTitle = signal('Preview toast');
  protected readonly playgroundDescription = signal('Secondary description text');
  protected readonly playgroundVariant = signal<PuiToastVariant>('success');
  protected readonly playgroundPosition = signal<PuiToastPosition>('bottom-right');
  protected readonly playgroundDuration = signal('4000');
  protected readonly playgroundRich = signal(false);
  protected readonly playgroundSnackbar = signal(false);
  protected readonly playgroundAction = signal(true);
  protected readonly playgroundLoading = signal(false);
  protected readonly playgroundShowIcon = signal(true);
  protected readonly playgroundCustomIcon = signal(false);

  protected readonly playgroundHtml = computed(
    () => `<pui-button (click)="showToast()">Show toast</pui-button>`
  );

  protected readonly playgroundExampleTabs = computed((): readonly PuiDocCodeTab[] =>
    buildPlaygroundExampleTabs({
      html: this.playgroundHtml(),
      componentClass: 'ToastPlaygroundComponent',
      componentImports: [BUTTON_IMPORT],
      services: [TOAST_SERVICE],
      members: [`showToast(): void {\n    ${this.buildPlaygroundCall()}\n  }`],
    })
  );

  protected triggerPlaygroundToast(): void {
    const position = this.playgroundPosition();
    const duration = Number(this.playgroundDuration());
    const action = this.playgroundAction()
      ? { label: 'Undo', onClick: () => undefined }
      : undefined;
    const iconOptions = this.playgroundShowIcon()
      ? this.playgroundCustomIcon()
        ? { iconName: 'bell' as const }
        : {}
      : { icon: false as const };

    if (this.playgroundLoading()) {
      const id = this.toast.loading('Processing…', { position, ...iconOptions });
      window.setTimeout(() => {
        this.toast.success('Done', { id, position, duration });
      }, 1400);
      return;
    }

    if (this.playgroundSnackbar()) {
      this.toast.snackbar(this.playgroundTitle(), {
        position,
        duration,
        action,
        ...iconOptions,
      });
      return;
    }

    if (this.playgroundRich()) {
      this.toast.rich({
        title: this.playgroundTitle(),
        description: this.playgroundDescription(),
        position,
        duration,
        action,
        actionLabel: action?.label,
        onAction: action?.onClick,
        ...iconOptions,
      });
      return;
    }

    this.toast.custom(this.playgroundTitle(), {
      variant: this.playgroundVariant(),
      position,
      duration,
      description: this.playgroundDescription() || undefined,
      action,
      ...iconOptions,
    });
  }

  protected showSuccess(): void {
    this.toast.success('Changes saved successfully');
  }

  protected showError(): void {
    this.toast.error('Unable to save changes');
  }

  protected showSnackbar(): void {
    this.toast.snackbar('File deleted', {
      actionLabel: 'Undo',
      onAction: () => undefined,
    });
  }

  protected showRich(): void {
    this.toast.rich({
      title: 'Deployment complete',
      description: 'Your app is now live on production.',
      actionLabel: 'View deployment',
      onAction: () => undefined,
    });
  }

  protected showPosition(position: PuiToastPosition): void {
    this.toast.info(`Toast at ${position}`, { position, title: position });
  }

  protected runLoadingDemo(): void {
    const id = this.toast.loading('Processing…');
    window.setTimeout(() => {
      this.toast.success('Done', { id });
    }, 1400);
  }

  protected runPromiseDemo(): void {
    void this.toast.promise(
      new Promise<void>((resolve) => window.setTimeout(resolve, 1500)),
      {
        loading: 'Uploading file…',
        success: 'Upload complete',
        error: 'Upload failed',
      }
    );
  }

  protected setPlaygroundVariant(value: PuiSelectValue | null): void {
    if (typeof value === 'string') {
      this.playgroundVariant.set(value as PuiToastVariant);
    }
  }

  protected setPlaygroundPosition(value: PuiSelectValue | null): void {
    if (typeof value === 'string') {
      this.playgroundPosition.set(value as PuiToastPosition);
    }
  }

  protected setPlaygroundDuration(value: PuiSelectValue | null): void {
    if (typeof value === 'string') {
      this.playgroundDuration.set(value);
    }
  }

  private buildPlaygroundCall(): string {
    const position = this.playgroundPosition();
    const duration = this.playgroundDuration();
    const iconOpts = this.buildIconOptionsSnippet();

    if (this.playgroundLoading()) {
      return [
        `const id = this.toast.loading('Processing…', { position: '${position}'${iconOpts.loading} });`,
        'window.setTimeout(() => {',
        `  this.toast.success('Done', { id, position: '${position}', duration: ${duration} });`,
        '}, 1400);',
      ].join('\n    ');
    }

    if (this.playgroundSnackbar()) {
      const action = this.playgroundAction() ? ", actionLabel: 'Undo'" : '';
      return `this.toast.snackbar('${this.playgroundTitle()}', { position: '${position}', duration: ${duration}${action}${iconOpts.inline} });`;
    }

    if (this.playgroundRich()) {
      const action = this.playgroundAction() ? ", actionLabel: 'Undo'" : '';
      return `this.toast.rich({ title: '${this.playgroundTitle()}', description: '${this.playgroundDescription()}', position: '${position}', duration: ${duration}${action}${iconOpts.inline} });`;
    }

    const action = this.playgroundAction() ? ", action: { label: 'Undo' }" : '';
    const description =
      this.playgroundDescription() !== 'Secondary description text'
        ? `, description: '${this.playgroundDescription()}'`
        : '';
    return `this.toast.${this.playgroundVariant()}('${this.playgroundTitle()}', { position: '${position}', duration: ${duration}${description}${action}${iconOpts.inline} });`;
  }

  private buildIconOptionsSnippet(): { inline: string; loading: string } {
    if (!this.playgroundShowIcon()) {
      return { inline: ', icon: false', loading: ', icon: false' };
    }

    if (this.playgroundCustomIcon()) {
      return { inline: ", iconName: 'bell'", loading: ", iconName: 'bell'" };
    }

    return { inline: '', loading: '' };
  }

  private isDocsTab(tab: string): tab is PuiDocsToastTab {
    return ['overview', 'examples', 'api', 'accessibility', 'theming', 'playground'].includes(tab);
  }
}

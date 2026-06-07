import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  ViewContainerRef,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { map } from 'rxjs';
import { PuiButtonComponent } from '../../../../premium-ui/components/button';
import { PuiCheckboxComponent } from '../../../../premium-ui/components/checkbox';
import { PuiSelectComponent } from '../../../../premium-ui/components/select';
import type { PuiSelectValue } from '../../../../premium-ui/components/select';
import {
  PuiDialogBodyComponent,
  PuiDialogComponent,
  PuiDialogConfirmComponent,
  PuiDialogFooterComponent,
  PuiDialogHeaderComponent,
  PuiDialogRef,
  PuiDialogService,
  PuiDialogTitleComponent,
  injectPuiDialogData,
  injectPuiDialogRef,
  type PuiDialogVariant,
  type PuiOverlayPosition,
  type PuiOverlayScrollStrategy,
} from '../../../../premium-ui/components/dialog';
import type { PuiDocApiRow, PuiDocA11yItem, PuiDocCodeTab, PuiDocsTab } from '../../docs.types';
import {
  PuiDocApiTableComponent,
  PuiDocA11yListComponent,
  PuiDocExampleComponent,
  PuiDocRelatedLinksComponent,
  buildLogicTabs,
  buildPlaygroundExampleTabs,
  buildServiceExampleTabs,
  buildThemeTabs,
  toSelectOptions,
} from '../../shared';
import { useDocsPageSeo } from '../../seo/use-docs-page-seo';
import { getRelatedLinks } from '../../seo/docs-seo.service';

type PuiDocsDialogTab =
  | 'overview'
  | 'examples'
  | 'api'
  | 'accessibility'
  | 'theming'
  | 'playground';

interface PuiDialogVariantMeta {
  readonly title: string;
  readonly description: string;
}

const DIALOG_SERVICE = {
  name: 'PuiDialogService',
  path: '@premium-ui/components/dialog',
} as const;

const BUTTON_IMPORT = {
  name: 'PuiButtonComponent',
  path: '@premium-ui/components/button',
} as const;

const DIALOG_IMPORTS = [
  { name: 'PuiDialogComponent', path: '@premium-ui/components/dialog' },
  { name: 'PuiDialogHeaderComponent', path: '@premium-ui/components/dialog' },
  { name: 'PuiDialogTitleComponent', path: '@premium-ui/components/dialog' },
  { name: 'PuiDialogBodyComponent', path: '@premium-ui/components/dialog' },
  { name: 'PuiDialogFooterComponent', path: '@premium-ui/components/dialog' },
  { name: 'PuiButtonComponent', path: '@premium-ui/components/button' },
] as const;

const VCR_IMPORT = {
  name: 'ViewContainerRef',
  path: '@angular/core',
} as const;

interface UserDialogData {
  readonly name: string;
  readonly email: string;
  readonly role: string;
  readonly variant?: PuiDialogVariant;
  /** When set, footer shows a control to open a stacked child dialog with this variant. */
  readonly stackChildVariant?: PuiDialogVariant;
}

interface UserDialogResult {
  readonly saved: boolean;
  readonly user: UserDialogData;
}

@Component({
  selector: 'demo-user-dialog',
  exportAs: 'demoUserDialog',
  imports: [
    PuiDialogComponent,
    PuiDialogHeaderComponent,
    PuiDialogTitleComponent,
    PuiDialogBodyComponent,
    PuiDialogFooterComponent,
    PuiButtonComponent,
  ],
  templateUrl: './demo-user-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class DemoUserDialogComponent {
  protected readonly user = injectPuiDialogData<UserDialogData>();
  private readonly dialog = inject(PuiDialogService);
  private readonly dialogRef = injectPuiDialogRef<DemoUserDialogComponent, UserDialogResult>();

  protected openChild(): void {
    const childVariant = this.user.stackChildVariant ?? 'confirm';

    this.dialog.open(DemoUserDialogComponent, {
      variant: childVariant,
      data: {
        name: 'Second layer',
        email: 'second@premium-ui.dev',
        role: `${childVariant} dialog on top`,
        variant: childVariant,
      },
    });
  }

  protected save(): void {
    this.dialogRef.close({ saved: true, user: this.user });
  }

  protected cancel(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-dialog-docs',
  imports: [
    PuiButtonComponent,
    PuiSelectComponent,
    PuiCheckboxComponent,
    PuiDialogComponent,
    PuiDialogHeaderComponent,
    PuiDialogTitleComponent,
    PuiDialogBodyComponent,
    PuiDialogFooterComponent,
    DemoUserDialogComponent,
    PuiDialogConfirmComponent,
    PuiDocApiTableComponent,
    PuiDocA11yListComponent,
    PuiDocExampleComponent,
    PuiDocRelatedLinksComponent,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './dialog-docs.component.html',
  styleUrl: './dialog-docs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogDocsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly vcr = inject(ViewContainerRef);
  protected readonly dialog = inject(PuiDialogService);

  private readonly deleteTpl = viewChild<TemplateRef<unknown>>('deleteDialog');

  private readonly routeTab = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('tab') ?? 'overview')),
    { initialValue: 'overview' }
  );

  protected readonly currentTab = computed<PuiDocsDialogTab>(() => {
    const tab = this.routeTab();
    return this.isDocsTab(tab) ? tab : 'overview';
  });

  protected readonly tabs: readonly PuiDocsTab[] = [
    { label: 'Overview', route: ['/docs/components/dialog/overview'] },
    { label: 'Examples', route: ['/docs/components/dialog/examples'] },
    { label: 'API Guide', route: ['/docs/components/dialog/api'] },
    { label: 'Accessibility', route: ['/docs/components/dialog/accessibility'] },
    { label: 'Theming', route: ['/docs/components/dialog/theming'] },
    { label: 'Playground', route: ['/docs/components/dialog/playground'] },
  ];

  constructor() {
    useDocsPageSeo({ slug: 'dialog', tab: this.currentTab });
  }

  protected readonly relatedLinks = getRelatedLinks('dialog');

  protected readonly variants: readonly PuiDialogVariant[] = [
    'default',
    'confirm',
    'fullscreen',
    'sheet',
    'danger',
  ];

  protected readonly variantMeta: Record<PuiDialogVariant, PuiDialogVariantMeta> = {
    default: {
      title: 'Default',
      description: 'Centered panel — ideal for forms, settings, and general content.',
    },
    confirm: {
      title: 'Confirm',
      description: 'Compact centered panel for confirmation flows.',
    },
    fullscreen: {
      title: 'Fullscreen',
      description: '96vw × 96vh — nearly full viewport with margin on all sides.',
    },
    sheet: {
      title: 'Sheet',
      description: 'Bottom sheet with slide-up motion for mobile-friendly actions.',
    },
    danger: {
      title: 'Danger',
      description: 'Destructive emphasis with danger title styling.',
    },
  };

  protected readonly positions = ['center', 'top', 'bottom', 'left', 'right'] as const;
  protected readonly scrollStrategies: readonly PuiOverlayScrollStrategy[] = [
    'block',
    'reposition',
    'noop',
  ];

  protected readonly variantOptions = toSelectOptions(this.variants);
  protected readonly positionOptions = toSelectOptions([...this.positions]);
  protected readonly scrollOptions = toSelectOptions(this.scrollStrategies);

  protected readonly pgVariant = signal<PuiDialogVariant>('default');
  protected readonly pgPosition = signal<string>('center');
  protected readonly pgScroll = signal<PuiOverlayScrollStrategy>('block');
  protected readonly pgWidth = signal('32rem');
  protected readonly pgHeight = signal('');
  protected readonly pgBackdrop = signal(true);
  protected readonly pgBackdropClosable = signal(true);

  protected readonly componentExampleTabs: readonly PuiDocCodeTab[] = [
    {
      id: 'opener-html',
      label: 'Opener HTML',
      language: 'html',
      filename: 'user-page.component.html',
      code: `<pui-button (click)="openUser()">View user</pui-button>`,
    },
    {
      id: 'opener-ts',
      label: 'Opener TS',
      language: 'typescript',
      filename: 'user-page.component.ts',
      code: `import { Component, inject } from '@angular/core';
import { PuiButtonComponent } from '@premium-ui/components/button';
import { PuiDialogService } from '@premium-ui/components/dialog';
import { UserDetailsDialogComponent } from './user-details-dialog.component';
import type { UserDialogData, UserDialogResult } from './user-dialog.types';

@Component({
  selector: 'app-user-page',
  imports: [PuiButtonComponent, UserDetailsDialogComponent],
  templateUrl: './user-page.component.html',
})
export class UserPageComponent {
  private readonly dialog = inject(PuiDialogService);

  openUser(): void {
    const ref = this.dialog.open<
      UserDetailsDialogComponent,
      UserDialogData,
      UserDialogResult
    >(UserDetailsDialogComponent, {
      data: {
        name: 'Alex Morgan',
        email: 'alex@premium-ui.dev',
        role: 'Engineering lead',
      },
    });

    ref.afterClosed().subscribe((result) => {
      if (result?.saved) {
        console.log('Saved user', result.user);
      }
    });
  }
}`,
    },
    {
      id: 'dialog-html',
      label: 'Dialog HTML',
      language: 'html',
      filename: 'user-details-dialog.component.html',
      code: `<pui-dialog ariaLabelledBy="user-dialog-title">
  <pui-dialog-header>
    <pui-dialog-title id="user-dialog-title">{{ user.name }}</pui-dialog-title>
  </pui-dialog-header>

  <pui-dialog-body>
    <p>{{ user.email }}</p>
    <p>{{ user.role }}</p>
  </pui-dialog-body>

  <pui-dialog-footer>
    <pui-button variant="ghost" (click)="cancel()">Cancel</pui-button>
    <pui-button (click)="save()">Save</pui-button>
  </pui-dialog-footer>
</pui-dialog>`,
    },
    {
      id: 'dialog-ts',
      label: 'Dialog TS',
      language: 'typescript',
      filename: 'user-details-dialog.component.ts',
      code: `import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  PuiDialogBodyComponent,
  PuiDialogComponent,
  PuiDialogFooterComponent,
  PuiDialogHeaderComponent,
  PuiDialogTitleComponent,
  injectPuiDialogData,
  injectPuiDialogRef,
} from '@premium-ui/components/dialog';
import { PuiButtonComponent } from '@premium-ui/components/button';
import type { UserDialogData, UserDialogResult } from './user-dialog.types';

@Component({
  selector: 'app-user-details-dialog',
  imports: [
    PuiDialogComponent,
    PuiDialogHeaderComponent,
    PuiDialogTitleComponent,
    PuiDialogBodyComponent,
    PuiDialogFooterComponent,
    PuiButtonComponent,
  ],
  templateUrl: './user-details-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailsDialogComponent {
  protected readonly user = injectPuiDialogData<UserDialogData>();
  private readonly dialogRef = injectPuiDialogRef<
    UserDetailsDialogComponent,
    UserDialogResult
  >();

  save(): void {
    this.dialogRef.close({ saved: true, user: this.user });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}`,
    },
    {
      id: 'dialog-types',
      label: 'Types',
      language: 'typescript',
      filename: 'user-dialog.types.ts',
      code: `export interface UserDialogData {
  readonly name: string;
  readonly email: string;
  readonly role: string;
}

export interface UserDialogResult {
  readonly saved: boolean;
  readonly user: UserDialogData;
}`,
    },
  ];

  protected readonly templateExampleTabs = buildServiceExampleTabs({
    html: `<pui-button variant="danger" (click)="openDelete()">Delete user</pui-button>

<ng-template #deleteDialog let-dialogRef="dialogRef">
  <pui-dialog variant="danger">
    <pui-dialog-header>
      <pui-dialog-title>Delete user?</pui-dialog-title>
    </pui-dialog-header>
    <pui-dialog-body>
      <p>This action cannot be undone.</p>
    </pui-dialog-body>
    <pui-dialog-footer>
      <pui-button variant="ghost" (click)="dialogRef.close()">Cancel</pui-button>
      <pui-button variant="danger" (click)="dialogRef.close(true)">Delete</pui-button>
    </pui-dialog-footer>
  </pui-dialog>
</ng-template>`,
    selector: 'app-dialog-template-demo',
    componentClass: 'DialogTemplateDemoComponent',
    componentImports: DIALOG_IMPORTS,
    services: [DIALOG_SERVICE, VCR_IMPORT],
    methods: [
      'private readonly vcr = inject(ViewContainerRef);',
      'private readonly deleteDialog = viewChild.required<TemplateRef<unknown>>("deleteDialog");',
      '',
      'openDelete(): void {',
      '  this.dialog.open(this.deleteDialog(), {',
      "    variant: 'danger',",
      '    backdropClosable: false,',
      '  }, this.vcr);',
      '}',
    ],
    htmlFilename: 'dialog-template-demo.component.html',
    tsFilename: 'dialog-template-demo.component.ts',
  });

  protected readonly sizingExampleTabs = buildServiceExampleTabs({
    html: `<pui-button (click)="openSized()">Open sized dialog</pui-button>`,
    selector: 'app-dialog-sizing-demo',
    componentClass: 'DialogSizingDemoComponent',
    componentImports: [BUTTON_IMPORT],
    services: [DIALOG_SERVICE],
    methods: [
      'openSized(): void {',
      '  this.dialog.open(MyDialogComponent, {',
      '    size: {',
      "      width: '40rem',",
      "      height: '24rem',",
      "      minWidth: '20rem',",
      "      maxWidth: 'calc(100vw - 2rem)',",
      "      maxHeight: '90vh',",
      '    },',
      '  });',
      '}',
    ],
    htmlFilename: 'dialog-sizing-demo.component.html',
    tsFilename: 'dialog-sizing-demo.component.ts',
  });

  protected readonly backdropExampleTabs = buildServiceExampleTabs({
    html: `<div class="dialog-demo-row">
  <pui-button variant="outline" (click)="openWithBackdrop()">With backdrop</pui-button>
  <pui-button variant="ghost" (click)="openWithoutBackdrop()">No backdrop</pui-button>
  <pui-button variant="outline" (click)="openLockedBackdrop()">Locked backdrop</pui-button>
</div>`,
    selector: 'app-dialog-backdrop-demo',
    componentClass: 'DialogBackdropDemoComponent',
    componentImports: [BUTTON_IMPORT],
    services: [DIALOG_SERVICE],
    methods: [
      'openWithBackdrop(): void {',
      '  this.dialog.open(MyDialogComponent, {',
      '    backdrop: true,',
      '    backdropClosable: true,',
      '  });',
      '}',
      '',
      'openWithoutBackdrop(): void {',
      '  this.dialog.open(MyDialogComponent, {',
      '    backdrop: false,',
      '  });',
      '}',
      '',
      'openLockedBackdrop(): void {',
      '  this.dialog.open(MyDialogComponent, {',
      '    backdrop: true,',
      '    backdropClosable: false,',
      '  });',
      '}',
    ],
    htmlFilename: 'dialog-backdrop-demo.component.html',
    tsFilename: 'dialog-backdrop-demo.component.ts',
  });

  protected readonly stackedExampleTabs = buildServiceExampleTabs({
    html: `<div class="dialog-demo-row">
  <pui-button (click)="openFirst()">Open first layer</pui-button>
  <pui-button variant="ghost" (click)="closeAll()">Close all</pui-button>
</div>`,
    selector: 'app-dialog-stacked-demo',
    componentClass: 'DialogStackedDemoComponent',
    componentImports: [BUTTON_IMPORT],
    services: [DIALOG_SERVICE],
    methods: [
      'openFirst(): void {',
      '  this.dialog.open(UserDialogComponent, {',
      '    data: {',
      '      name: "First layer",',
      '      email: "first@premium-ui.dev",',
      '      role: "Open second dialog from footer",',
      '      stackChildVariant: "confirm",',
      '    },',
      '  });',
      '}',
      '',
      '// Inside UserDialogComponent footer:',
      'this.dialog.open(UserDialogComponent, { variant: "confirm", data: { ... } });',
      '',
      'closeAll(): void {',
      '  this.dialog.closeAll();',
      '}',
    ],
    htmlFilename: 'dialog-stacked-demo.component.html',
    tsFilename: 'dialog-stacked-demo.component.ts',
  });

  protected readonly confirmExampleTabs = buildServiceExampleTabs({
    html: `<pui-button variant="danger" (click)="remove()">Remove workspace</pui-button>`,
    selector: 'app-dialog-confirm-demo',
    componentClass: 'DialogConfirmDemoComponent',
    componentImports: [BUTTON_IMPORT],
    services: [DIALOG_SERVICE],
    methods: [
      'async remove(): Promise<void> {',
      '  const confirmed = await this.dialog.confirm({',
      "    title: 'Remove workspace?',",
      "    message: 'All projects in this workspace will be archived.',",
      "    confirmLabel: 'Remove',",
      "    variant: 'danger',",
      '  });',
      '',
      '  if (confirmed) {',
      '    // proceed',
      '  }',
      '}',
    ],
    htmlFilename: 'dialog-confirm-demo.component.html',
    tsFilename: 'dialog-confirm-demo.component.ts',
  });

  protected readonly serviceApiExampleTabs = buildLogicTabs({
    services: [DIALOG_SERVICE],
    filename: 'dialog-service.ts',
    code: `// open() returns PuiDialogRef<TComponent, TResult>
const ref = this.dialog.open<
  UserDetailsDialogComponent,
  UserDialogData,
  UserDialogResult
>(UserDetailsDialogComponent, {
  variant: 'default',
  data: { name: 'Alex', email: 'alex@example.com', role: 'Admin' },
  size: { width: '32rem', maxHeight: '90vh' },
  backdrop: true,
  backdropClosable: true,
});

// Result from dialogRef.close(result) arrives on afterClosed
ref.afterClosed().subscribe((result) => {
  if (result?.saved) {
    console.log('Dialog saved', result.user);
  }
});

// Lifecycle streams (Material-aligned)
ref.afterOpened().subscribe(() => console.log('opened'));
ref.beforeClosed().subscribe((result) => console.log('closing', result));

// Open template dialog
this.dialog.open(this.myTemplate, { variant: 'danger' }, this.vcr);

// Confirm helper
const ok = await this.dialog.confirm({
  title: 'Delete item?',
  message: 'This cannot be undone.',
  variant: 'danger',
});

this.dialog.close();
this.dialog.closeAll();`,
  });

  protected readonly refApiExampleTabs = buildLogicTabs({
    services: [
      { name: 'injectPuiDialogData', path: '@premium-ui/components/dialog' },
      { name: 'injectPuiDialogRef', path: '@premium-ui/components/dialog' },
    ],
    filename: 'user-details-dialog.component.ts',
    code: `protected readonly user = injectPuiDialogData<UserDialogData>();
private readonly dialogRef = injectPuiDialogRef<
  UserDetailsDialogComponent,
  UserDialogResult
>();

save(): void {
  this.dialogRef.close({ saved: true, user: this.user });
}

cancel(): void {
  this.dialogRef.close(); // afterClosed emits undefined
}`,
  });

  protected readonly playgroundExampleTabs = buildPlaygroundExampleTabs({
    html: `<pui-button (click)="openPlayground()">Open configured dialog</pui-button>`,
    componentClass: 'DialogPlaygroundComponent',
    componentImports: [BUTTON_IMPORT],
    services: [DIALOG_SERVICE],
    members: [
      "pgVariant = signal<PuiDialogVariant>('default');",
      "pgWidth = signal('32rem');",
      "pgBackdrop = signal(true);",
      'openPlayground(): void {',
      '  const variant = this.pgVariant();',
      '  const size = variant === "fullscreen"',
      '    ? { width: "96vw", height: "96vh" }',
      '    : { width: this.pgWidth(), maxWidth: "calc(100vw - 2rem)" };',
      '  this.dialog.open(DemoUserDialogComponent, {',
      '    variant,',
      '    backdrop: this.pgBackdrop(),',
      '    size,',
      '    data: { name: "Playground", email: "demo@premium-ui.dev", role: "Preview" },',
      '  });',
      '}',
    ],
  });

  protected readonly themeTabs = buildThemeTabs(`:root {
  --pui-dialog-surface: var(--pui-color-surface);
  --pui-dialog-border: color-mix(in srgb, var(--pui-color-border) 72%, transparent);
  --pui-dialog-radius: var(--pui-radius-xl);
  --pui-dialog-shadow: var(--pui-shadow-xl);
}`);

  protected readonly serviceApiRows: readonly PuiDocApiRow[] = [
    {
      name: 'open<TComponent, TData, TResult>(content, config?, viewContainerRef?)',
      type: 'PuiDialogRef<TComponent, TResult>',
      defaultValue: '—',
      description: 'Opens a template or component dialog. Templates require a ViewContainerRef.',
    },
    {
      name: 'close(result?)',
      type: 'void',
      defaultValue: '—',
      description: 'Closes the topmost open dialog.',
    },
    {
      name: 'closeAll()',
      type: 'void',
      defaultValue: '—',
      description: 'Closes every open dialog from top to bottom.',
    },
    {
      name: 'confirm(config)',
      type: 'Promise<boolean>',
      defaultValue: '—',
      description: 'Opens a built-in confirm dialog. Resolves true on confirm, false otherwise.',
    },
    {
      name: 'updateSize(size)',
      type: 'void',
      defaultValue: '—',
      description: 'Updates dimensions on the topmost dialog.',
    },
    {
      name: 'updatePosition(position?)',
      type: 'void',
      defaultValue: '—',
      description: 'Repositions the topmost dialog overlay.',
    },
  ];

  protected readonly configApiRows: readonly PuiDocApiRow[] = [
    { name: 'data', type: 'D', defaultValue: '—', description: 'Payload injected via injectPuiDialogData().' },
    { name: 'variant', type: 'PuiDialogVariant', defaultValue: "'default'", description: 'default | confirm | fullscreen | sheet | danger' },
    { name: 'size.width', type: 'string', defaultValue: 'variant default', description: 'Panel width (e.g. 32rem, 100vw).' },
    { name: 'size.height', type: 'string', defaultValue: 'auto', description: 'Panel height (e.g. 24rem, 100vh).' },
    { name: 'size.minWidth / maxWidth', type: 'string', defaultValue: '—', description: 'Responsive bounds for the panel.' },
    { name: 'position', type: 'PuiOverlayPosition', defaultValue: "'center'", description: 'center | top | bottom | left | right | { top: "24px" }' },
    { name: 'backdrop', type: 'boolean', defaultValue: 'true', description: 'Show dimmed backdrop behind the panel.' },
    { name: 'backdropClosable', type: 'boolean', defaultValue: 'true', description: 'Close when backdrop is clicked.' },
    { name: 'closeOnEscape', type: 'boolean', defaultValue: 'true', description: 'Close when Escape is pressed (topmost only).' },
    { name: 'scrollStrategy', type: "'block' | 'reposition' | 'noop'", defaultValue: "'block'", description: 'Body scroll lock strategy.' },
  ];

  protected readonly injectionApiRows: readonly PuiDocApiRow[] = [
    {
      name: 'PUI_DIALOG_DATA',
      type: 'InjectionToken<D>',
      defaultValue: '—',
      description: 'Provided by PuiDialogService.open() — payload from config.data.',
    },
    {
      name: 'PUI_DIALOG_REF',
      type: 'InjectionToken<PuiDialogRef>',
      defaultValue: '—',
      description: 'Provided by PuiDialogService.open() — same instance as open() return value.',
    },
    {
      name: 'injectPuiDialogData<T>()',
      type: 'function',
      defaultValue: '—',
      description: 'Typed helper — inject config.data inside component dialogs.',
    },
    {
      name: 'injectPuiDialogRef<TComponent, TResult>()',
      type: 'function',
      defaultValue: '—',
      description: 'Typed helper — inject ref to call close(result) inside component dialogs.',
    },
  ];

  protected readonly refApiRows: readonly PuiDocApiRow[] = [
    { name: 'close(result?)', type: 'void', defaultValue: '—', description: 'Close dialog; emits beforeClosed then afterClosed.' },
    { name: 'afterOpened()', type: 'Observable<void>', defaultValue: '—', description: 'Emits once when the dialog has finished opening.' },
    { name: 'beforeClosed()', type: 'Observable<TResult | undefined>', defaultValue: '—', description: 'Emits when close() is called, before exit animation.' },
    { name: 'afterClosed()', type: 'Observable<TResult | undefined>', defaultValue: '—', description: 'Emits once after exit animation and overlay disposal.' },
    { name: 'backdropClick()', type: 'Observable<MouseEvent>', defaultValue: '—', description: 'Backdrop pointer events for custom close logic.' },
    { name: 'keydownEvents()', type: 'Observable<KeyboardEvent>', defaultValue: '—', description: 'Keyboard events for custom shortcuts or close rules.' },
    { name: 'updateSize(size)', type: 'void', defaultValue: '—', description: 'Update panel width/height at runtime.' },
    { name: 'updatePosition(position?)', type: 'void', defaultValue: '—', description: 'Reposition overlay pane.' },
    { name: 'componentInstance', type: 'TComponent | undefined', defaultValue: '—', description: 'Live component instance for component dialogs.' },
    { name: 'isClosed()', type: 'boolean', defaultValue: '—', description: 'Whether the dialog has been closed.' },
  ];

  protected readonly primitiveApiRows: readonly PuiDocApiRow[] = [
    { name: 'pui-dialog', type: 'component', defaultValue: '—', description: 'Dialog shell with variant and ARIA inputs.' },
    { name: 'pui-dialog-header', type: 'component', defaultValue: '—', description: 'Header region with bottom border.' },
    { name: 'pui-dialog-title', type: 'component', defaultValue: '—', description: 'Heading element — wire id for aria-labelledby.' },
    { name: 'pui-dialog-body', type: 'component', defaultValue: '—', description: 'Scrollable content region.' },
    { name: 'pui-dialog-footer', type: 'component', defaultValue: '—', description: 'Action row aligned to the end.' },
  ];

  protected readonly a11yItems: readonly PuiDocA11yItem[] = [
    { title: 'Focus trap', description: 'Focus is trapped inside the dialog while open using CDK FocusTrap.' },
    { title: 'Focus restoration', description: 'Focus returns to the trigger when the last dialog in the stack closes.' },
    { title: 'Escape key', description: 'Only the topmost dialog closes on Escape.' },
    { title: 'ARIA', description: 'role="dialog", aria-modal="true", and labelledby/describedby support.' },
    { title: 'Stacked dialogs', description: 'Multiple dialogs stack with managed z-index; each layer is independently dismissible.' },
  ];

  protected openComponent(): void {
    const ref = this.dialog.open<DemoUserDialogComponent, UserDialogData, UserDialogResult>(
      DemoUserDialogComponent,
      {
        data: {
          name: 'Alex Morgan',
          email: 'alex@premium-ui.dev',
          role: 'Engineering lead',
        },
      }
    );

    ref.afterClosed().subscribe((result) => {
      if (result?.saved) {
        console.info('[Dialog docs] User saved', result.user);
      }
    });
  }

  protected openTemplate(): void {
    const tpl = this.deleteTpl();
    if (!tpl) {
      return;
    }

    this.dialog.open(tpl, { variant: 'danger', backdropClosable: false }, this.vcr);
  }

  protected async openConfirm(): Promise<void> {
    await this.dialog.confirm({
      title: 'Remove workspace?',
      message: 'All projects in this workspace will be archived.',
      confirmLabel: 'Remove',
      variant: 'danger',
    });
  }

  protected openVariant(variant: PuiDialogVariant): void {
    this.dialog.open(DemoUserDialogComponent, {
      variant,
      data: {
        name: `${variant} dialog`,
        email: 'demo@premium-ui.dev',
        role: 'Preview',
        variant,
      },
      backdropClosable: true,
    });
  }

  protected openSized(): void {
    this.dialog.open(DemoUserDialogComponent, {
      size: {
        width: '40rem',
        height: '20rem',
        maxWidth: 'calc(100vw - 2rem)',
        maxHeight: '90vh',
      },
      data: {
        name: 'Sized dialog',
        email: 'sizing@premium-ui.dev',
        role: '40rem × 20rem',
      },
    });
  }

  protected openWithBackdrop(): void {
    this.dialog.open(DemoUserDialogComponent, {
      backdrop: true,
      backdropClosable: true,
      data: { name: 'With backdrop', email: 'backdrop@premium-ui.dev', role: 'Click outside to close' },
    });
  }

  protected openWithoutBackdrop(): void {
    this.dialog.open(DemoUserDialogComponent, {
      backdrop: false,
      data: { name: 'No backdrop', email: 'plain@premium-ui.dev', role: 'No dimmed layer' },
    });
  }

  protected openLockedBackdrop(): void {
    this.dialog.open(DemoUserDialogComponent, {
      backdrop: true,
      backdropClosable: false,
      data: { name: 'Locked backdrop', email: 'locked@premium-ui.dev', role: 'Use Close button or Escape' },
    });
  }

  protected openStackedFirst(): void {
    this.dialog.open(DemoUserDialogComponent, {
      data: {
        name: 'First layer',
        email: 'first@premium-ui.dev',
        role: 'Use the footer action to open a confirm variant on top',
        stackChildVariant: 'confirm',
      },
    });
  }

  protected openStackedSecond(): void {
    this.dialog.open(DemoUserDialogComponent, {
      variant: 'confirm',
      data: {
        name: 'Second layer',
        email: 'second@premium-ui.dev',
        role: 'Confirm variant on top',
        variant: 'confirm',
      },
    });
  }

  protected closeAllDialogs(): void {
    this.dialog.closeAll();
  }

  protected onVariantChange(value: PuiSelectValue): void {
    const variant = value as PuiDialogVariant;
    this.pgVariant.set(variant);

    if (variant === 'fullscreen') {
      this.pgWidth.set('calc(100vw - 2rem)');
      this.pgHeight.set('calc(100vh - 2rem)');
      return;
    }

    if (variant === 'sheet') {
      this.pgWidth.set('calc(100vw - 2rem)');
      this.pgHeight.set('');
      return;
    }

    this.pgWidth.set('32rem');
    this.pgHeight.set('');
  }

  protected onPositionChange(value: PuiSelectValue): void {
    this.pgPosition.set(String(value));
  }

  protected onScrollChange(value: PuiSelectValue): void {
    this.pgScroll.set(value as PuiOverlayScrollStrategy);
  }

  protected onWidthInput(event: Event): void {
    this.pgWidth.set((event.target as HTMLInputElement).value);
  }

  protected onHeightInput(event: Event): void {
    this.pgHeight.set((event.target as HTMLInputElement).value);
  }

  protected openPlayground(): void {
    const variant = this.pgVariant();
    const width = this.pgWidth().trim();
    const height = this.pgHeight().trim();

    const size =
      variant === 'fullscreen'
        ? {
            width: width || '96vw',
            height: height || '96vh',
          }
        : {
            width: width || '32rem',
            ...(height ? { height } : {}),
            maxWidth: 'calc(100vw - 2rem)',
          };

    this.dialog.open(DemoUserDialogComponent, {
      variant,
      position: this.pgPosition() as PuiOverlayPosition,
      scrollStrategy: this.pgScroll(),
      backdrop: this.pgBackdrop(),
      backdropClosable: this.pgBackdropClosable(),
      size,
      data: {
        name: 'Playground dialog',
        email: 'playground@premium-ui.dev',
        role: this.pgVariant(),
      },
    });
  }

  private isDocsTab(tab: string): tab is PuiDocsDialogTab {
    return ['overview', 'examples', 'api', 'accessibility', 'theming', 'playground'].includes(tab);
  }
}

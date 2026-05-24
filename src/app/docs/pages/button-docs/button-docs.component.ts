import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { map } from 'rxjs';
import { PuiButtonComponent } from '../../../../premium-ui/components/button';
import type { PuiButtonSize, PuiButtonVariant } from '../../../../premium-ui/components/button';
import { PuiCheckboxComponent } from '../../../../premium-ui/components/checkbox';
import { PuiSelectComponent } from '../../../../premium-ui/components/select';
import type { PuiSelectValue } from '../../../../premium-ui/components/select';
import type { PuiDocCodeTab, PuiDocApiRow, PuiDocA11yItem, PuiDocKeyboardShortcut, PuiDocsTab } from '../../docs.types';
import {
  PuiDocApiTableComponent,
  PuiDocA11yListComponent,
  PuiDocCodeBlockComponent,
  PuiDocExampleComponent,
  PuiDocKeyboardShortcutsComponent,
  buildHtmlTsTabs,
  buildPlaygroundTsExample,
  toSelectOptions,
} from '../../shared';

type PuiDocsButtonTab = 'overview' | 'examples' | 'api' | 'accessibility' | 'theming' | 'playground';

interface PuiButtonExample {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly code: string;
  readonly variant?: PuiButtonVariant;
  readonly size?: PuiButtonSize;
  readonly loading?: boolean;
  readonly disabled?: boolean;
  readonly icon?: boolean;
}

@Component({
  selector: 'app-button-docs',
  imports: [
    PuiButtonComponent,
    PuiSelectComponent,
    PuiCheckboxComponent,
    PuiDocApiTableComponent,
    PuiDocA11yListComponent,
    PuiDocCodeBlockComponent,
    PuiDocExampleComponent,
    PuiDocKeyboardShortcutsComponent,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './button-docs.component.html',
  styleUrl: './button-docs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonDocsComponent {
  private readonly route = inject(ActivatedRoute);

  private readonly routeTab = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('tab') ?? 'overview')),
    { initialValue: 'overview' }
  );

  protected readonly currentTab = computed<PuiDocsButtonTab>(() => {
    const tab = this.routeTab();
    return this.isDocsTab(tab) ? tab : 'overview';
  });

  protected readonly tabs: readonly PuiDocsTab[] = [
    { label: 'Overview', route: ['/docs/components/button/overview'] },
    { label: 'Examples', route: ['/docs/components/button/examples'] },
    { label: 'API Guide', route: ['/docs/components/button/api'] },
    { label: 'Accessibility', route: ['/docs/components/button/accessibility'] },
    { label: 'Theming', route: ['/docs/components/button/theming'] },
    { label: 'Playground', route: ['/docs/components/button/playground'] },
  ];

  protected readonly variants: readonly PuiButtonVariant[] = ['primary', 'secondary', 'outline', 'ghost', 'danger'];
  protected readonly sizes: readonly PuiButtonSize[] = ['sm', 'md', 'lg'];
  protected readonly variantOptions = toSelectOptions(this.variants);
  protected readonly sizeOptions = toSelectOptions(this.sizes);

  protected formatLabel(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  protected readonly htmlExample = '<pui-button>Save changes</pui-button>';

  protected readonly basicExampleTabs = buildHtmlTsTabs(this.htmlExample, {
    selector: 'app-button-example',
    componentClass: 'ButtonExampleComponent',
    imports: [{ name: 'PuiButtonComponent', path: '@premium-ui/components/button' }],
    templateUrl: './button-example.component.html',
  });

  protected readonly variantExampleCode = `<pui-button variant="primary">Primary</pui-button>
<pui-button variant="secondary">Secondary</pui-button>
<pui-button variant="outline">Outline</pui-button>
<pui-button variant="ghost">Ghost</pui-button>
<pui-button variant="danger">Danger</pui-button>`;

  protected readonly sizeExampleCode = `<pui-button size="sm">Small</pui-button>
<pui-button size="md">Medium</pui-button>
<pui-button size="lg">Large</pui-button>`;

  protected readonly stateExampleCode = `<pui-button>Default</pui-button>
<pui-button variant="secondary">Active</pui-button>
<pui-button [disabled]="true">Disabled</pui-button>
<pui-button [loading]="true">Loading</pui-button>`;

  protected readonly examples: readonly PuiButtonExample[] = [
    {
      id: 'basic-usage',
      title: 'Basic usage',
      description: 'Use the default primary button for the most important action on a surface.',
      code: '<pui-button>Save changes</pui-button>',
    },
    {
      id: 'outline-icon',
      title: 'Outline with icon',
      description: 'Project an icon into the icon slot while keeping the label accessible.',
      variant: 'outline',
      icon: true,
      code: `<pui-button variant="outline">
  <span puiButtonIcon aria-hidden="true">+</span>
  New item
</pui-button>`,
    },
    {
      id: 'loading-state',
      title: 'Loading state',
      description: 'Loading disables pointer actions and exposes aria-busy.',
      loading: true,
      code: '<pui-button [loading]="true">Saving</pui-button>',
    },
    {
      id: 'disabled-state',
      title: 'Disabled state',
      description: 'Disabled buttons remain visible but do not emit pressed events.',
      disabled: true,
      code: '<pui-button [disabled]="true">Unavailable</pui-button>',
    },
  ];

  protected exampleTabs(example: PuiButtonExample): readonly PuiDocCodeTab[] {
    return buildHtmlTsTabs(example.code, {
      selector: `app-${example.id}`,
      componentClass: `${this.toPascalCase(example.id)}ExampleComponent`,
      imports: [{ name: 'PuiButtonComponent', path: '@premium-ui/components/button' }],
      templateUrl: `./${example.id}.component.html`,
    });
  }

  protected variantTabs(variant: PuiButtonVariant): readonly PuiDocCodeTab[] {
    const code = `<pui-button variant="${variant}">${this.formatLabel(variant)}</pui-button>`;
    return buildHtmlTsTabs(code, {
      selector: `app-button-${variant}`,
      componentClass: `Button${this.formatLabel(variant)}ExampleComponent`,
      imports: [{ name: 'PuiButtonComponent', path: '@premium-ui/components/button' }],
      templateUrl: `./button-${variant}.component.html`,
    });
  }

  protected readonly apiRows: readonly PuiDocApiRow[] = [
    { name: 'variant', type: 'PuiButtonVariant', defaultValue: 'primary', description: 'Controls the visual treatment and semantic intent.' },
    { name: 'size', type: 'PuiButtonSize', defaultValue: 'md', description: 'Controls height, padding, and label size.' },
    { name: 'type', type: 'button | submit | reset', defaultValue: 'button', description: 'Passes the native button type to the internal control.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables interaction and applies disabled styling.' },
    { name: 'loading', type: 'boolean', defaultValue: 'false', description: 'Shows a spinner, sets aria-busy, and disables interaction.' },
    { name: 'ariaLabel', type: 'string | null', defaultValue: 'null', description: 'Supplies an accessible label for icon-only buttons.' },
  ];

  protected readonly outputRows: readonly PuiDocApiRow[] = [
    { name: 'pressed', type: 'MouseEvent', defaultValue: '-', description: 'Emits when the button is clicked while enabled.' },
  ];

  protected readonly a11yItems: readonly PuiDocA11yItem[] = [
    { title: 'Native button', code: 'button', description: 'Uses a semantic button element for reliable keyboard and screen reader support.' },
    { title: 'Focus visible', code: ':focus-visible', description: 'Applies a high-contrast focus ring that meets WCAG AA requirements.' },
    { title: 'Busy state', code: 'aria-busy', description: 'Announces loading state and prevents duplicate activation.' },
    { title: 'Icon-only label', code: 'ariaLabel', description: 'Required when the button has no visible text label.' },
    { title: 'Disabled & loading', description: 'Interaction is blocked and events are not emitted while disabled or loading.' },
  ];

  protected readonly keyboardShortcuts: readonly PuiDocKeyboardShortcut[] = [
    { keys: ['Enter'], description: 'Activate the button when focused.' },
    { keys: ['Space'], description: 'Activate the button when focused.' },
  ];

  protected readonly themeCode = `:root {
  --pui-color-primary: #4f46e5;
  --pui-color-primary-hover: #4338ca;
  --pui-radius-md: 0.5rem;
}`;

  protected readonly playgroundVariant = signal<PuiButtonVariant>('primary');
  protected readonly playgroundSize = signal<PuiButtonSize>('md');
  protected readonly playgroundDisabled = signal(false);
  protected readonly playgroundLoading = signal(false);
  protected readonly playgroundCodeExpanded = signal(false);

  protected readonly playgroundCode = computed(() => {
    const disabled = this.playgroundDisabled() ? ' [disabled]="true"' : '';
    const loading = this.playgroundLoading() ? ' [loading]="true"' : '';
    const variant =
      this.playgroundVariant() !== 'primary' ? ` variant="${this.playgroundVariant()}"` : '';
    const size = this.playgroundSize() !== 'md' ? ` size="${this.playgroundSize()}"` : '';

    return `<pui-button${variant}${size}${disabled}${loading}>
  Preview action
</pui-button>`;
  });

  protected readonly playgroundExampleTabs = computed((): readonly PuiDocCodeTab[] => [
    { id: 'html', label: 'HTML', code: this.playgroundCode(), language: 'html', filename: 'playground.component.html' },
    {
      id: 'ts',
      label: 'TypeScript',
      code: this.playgroundTsExample(),
      language: 'typescript',
      filename: 'playground.component.ts',
    },
  ]);

  protected readonly playgroundTsExample = computed(() =>
    buildPlaygroundTsExample({
      componentClass: 'ButtonPlaygroundComponent',
      imports: [{ name: 'PuiButtonComponent', path: '@premium-ui/components/button' }],
      members: [
        `protected readonly variant = signal('${this.playgroundVariant()}' as const);`,
        `protected readonly size = signal('${this.playgroundSize()}' as const);`,
        `protected readonly disabled = signal(${this.playgroundDisabled()});`,
        `protected readonly loading = signal(${this.playgroundLoading()});`,
      ],
    })
  );

  protected setPlaygroundVariant(value: PuiSelectValue | null): void {
    if (typeof value === 'string') {
      this.playgroundVariant.set(value as PuiButtonVariant);
    }
  }

  protected setPlaygroundSize(value: PuiSelectValue | null): void {
    if (typeof value === 'string') {
      this.playgroundSize.set(value as PuiButtonSize);
    }
  }

  private isDocsTab(tab: string): tab is PuiDocsButtonTab {
    return ['overview', 'examples', 'api', 'accessibility', 'theming', 'playground'].includes(tab);
  }

  private toPascalCase(value: string): string {
    return value
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
  }
}

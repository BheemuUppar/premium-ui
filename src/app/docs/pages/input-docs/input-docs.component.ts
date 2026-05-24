import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { map } from 'rxjs';
import { PuiInputComponent } from '../../../../premium-ui/components/input';
import type { PuiInputType } from '../../../../premium-ui/components/input';
import { PuiCheckboxComponent } from '../../../../premium-ui/components/checkbox';
import { PuiSelectComponent } from '../../../../premium-ui/components/select';
import type { PuiSelectValue } from '../../../../premium-ui/components/select';
import type { PuiDocCodeTab, PuiDocApiRow, PuiDocA11yItem, PuiDocKeyboardShortcut, PuiDocsTab } from '../../docs.types';
import type { PuiSize } from '../../../../premium-ui/types/common.types';
import {
  PuiDocApiTableComponent,
  PuiDocA11yListComponent,
  PuiDocExampleComponent,
  PuiDocKeyboardShortcutsComponent,
  buildHtmlTsTabs,
  buildPlaygroundTsExample,
  buildThemeTabs,
  toSelectOptions,
} from '../../shared';
import { useDocsPageSeo } from '../../seo/use-docs-page-seo';

type PuiDocsInputTab = 'overview' | 'examples' | 'api' | 'accessibility' | 'theming' | 'playground';

interface PuiApiRow extends PuiDocApiRow {}

@Component({
  selector: 'app-input-docs',
  imports: [PuiInputComponent, PuiSelectComponent, PuiCheckboxComponent, PuiDocApiTableComponent, PuiDocA11yListComponent, PuiDocExampleComponent, PuiDocKeyboardShortcutsComponent, RouterLink, RouterLinkActive],
  templateUrl: './input-docs.component.html',
  styleUrl: './input-docs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputDocsComponent {
  private readonly route = inject(ActivatedRoute);

  private readonly routeTab = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('tab') ?? 'overview')),
    { initialValue: 'overview' }
  );

  protected readonly currentTab = computed<PuiDocsInputTab>(() => {
    const tab = this.routeTab();
    return this.isDocsTab(tab) ? tab : 'overview';
  });

  protected readonly tabs: readonly PuiDocsTab[] = [
    { label: 'Overview', route: ['/docs/components/input/overview'] },
    { label: 'Examples', route: ['/docs/components/input/examples'] },
    { label: 'API Guide', route: ['/docs/components/input/api'] },
    { label: 'Accessibility', route: ['/docs/components/input/accessibility'] },
    { label: 'Theming', route: ['/docs/components/input/theming'] },
    { label: 'Playground', route: ['/docs/components/input/playground'] }
  ];

  constructor() {
    useDocsPageSeo({ slug: 'input', tab: this.currentTab });
  }

  protected readonly inputTypes: readonly PuiInputType[] = ['text', 'email', 'password', 'search', 'tel', 'url', 'number'];
  protected readonly sizes: readonly PuiSize[] = ['sm', 'md', 'lg'];
  protected readonly typeOptions = toSelectOptions(this.inputTypes);
  protected readonly sizeOptions = toSelectOptions(this.sizes);

  protected readonly apiRows: readonly PuiApiRow[] = [
    { name: 'type', type: 'PuiInputType', defaultValue: 'text', description: 'Sets the native input type.' },
    { name: 'size', type: 'PuiSize', defaultValue: 'md', description: 'Controls the input height and font size.' },
    { name: 'placeholder', type: 'string | null', defaultValue: 'null', description: 'Text shown when the field is empty.' },
    { name: 'ariaLabel', type: 'string | null', defaultValue: 'null', description: 'Accessible label for the input when needed.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables user interaction.' },
    { name: 'readOnly', type: 'boolean', defaultValue: 'false', description: 'Makes the input read-only.' }
  ];

  protected readonly overviewExampleCode = '<pui-input placeholder="Type here"></pui-input>';

  protected readonly statesExampleCode = `<pui-input placeholder="Default"></pui-input>
<pui-input placeholder="Disabled" [disabled]="true"></pui-input>
<pui-input placeholder="Read only" [readOnly]="true" value="Read only"></pui-input>`;

  protected readonly overviewExampleTabs = buildHtmlTsTabs(this.overviewExampleCode, {
    selector: 'app-input-overview',
    componentClass: 'InputOverviewExampleComponent',
    imports: [{ name: 'PuiInputComponent', path: '@premium-ui/components/input' }],
    templateUrl: './input-overview.component.html',
  });

  protected readonly statesExampleTabs = buildHtmlTsTabs(this.statesExampleCode, {
    selector: 'app-input-states',
    componentClass: 'InputStatesExampleComponent',
    imports: [{ name: 'PuiInputComponent', path: '@premium-ui/components/input' }],
    templateUrl: './input-states.component.html',
  });

  protected inputTypeExampleTabs(type: string): readonly PuiDocCodeTab[] {
    return buildHtmlTsTabs(this.inputTypeExample(type), {
      selector: `app-input-${type}`,
      componentClass: `Input${type.charAt(0).toUpperCase()}${type.slice(1)}ExampleComponent`,
      imports: [{ name: 'PuiInputComponent', path: '@premium-ui/components/input' }],
      templateUrl: `./input-${type}.component.html`,
    });
  }

  protected readonly themeTabs = buildThemeTabs(`:root {
  --pui-input-background: #ffffff;
  --pui-input-border: #d1d5db;
  --pui-input-border-hover: #6366f1;
}`);

  protected readonly playgroundType = signal<PuiInputType>('text');
  protected readonly playgroundSize = signal<PuiSize>('md');
  protected readonly playgroundPlaceholder = signal('Enter text');
  protected readonly playgroundDisabled = signal(false);
  protected readonly playgroundReadOnly = signal(false);

  protected readonly playgroundCode = computed(() => {
    const disabled = this.playgroundDisabled() ? ' [disabled]="true"' : '';
    const readOnly = this.playgroundReadOnly() ? ' [readOnly]="true"' : '';
    return `<pui-input type="${this.playgroundType()}" size="${this.playgroundSize()}" placeholder="${this.playgroundPlaceholder()}"${disabled}${readOnly}></pui-input>`;
  });

  protected readonly playgroundExampleTabs = computed((): readonly PuiDocCodeTab[] => [
    {
      id: 'html',
      label: 'HTML',
      code: this.playgroundCode(),
      language: 'html',
      filename: 'playground.component.html',
    },
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
      componentClass: 'InputPlaygroundComponent',
      imports: [{ name: 'PuiInputComponent', path: '@premium-ui/components/input' }],
      members: [
        `protected readonly type = signal('${this.playgroundType()}' as const);`,
        `protected readonly size = signal('${this.playgroundSize()}' as const);`,
        `protected readonly placeholder = signal('${this.playgroundPlaceholder()}');`,
        `protected readonly disabled = signal(${this.playgroundDisabled()});`,
        `protected readonly readOnly = signal(${this.playgroundReadOnly()});`,
      ],
    })
  );

  protected setPlaygroundType(value: PuiSelectValue | null): void {
    if (typeof value === 'string') {
      this.playgroundType.set(value as PuiInputType);
    }
  }

  protected setPlaygroundSize(value: PuiSelectValue | null): void {
    if (typeof value === 'string') {
      this.playgroundSize.set(value as PuiSize);
    }
  }

  protected inputTypeExample(type: string): string {
    return `<pui-input type="${type}" placeholder="${type}"></pui-input>`;
  }

  protected readonly a11yItems: readonly PuiDocA11yItem[] = [
    { title: 'Native input', code: 'input', description: 'Built on a native text input for predictable keyboard and AT behavior.' },
    { title: 'Labelling', code: 'ariaLabel', description: 'Provide a visible label or ariaLabel when the field has no adjacent label text.' },
    { title: 'Descriptions', code: 'aria-describedby', description: 'Helper and error copy can be associated with the control for screen readers.' },
    { title: 'Invalid state', code: 'aria-invalid', description: 'Invalid inputs expose error state to assistive technologies.' },
    { title: 'Focus ring', code: ':focus-visible', description: 'Visible focus styles use shared premium-ui focus tokens for WCAG contrast.' },
  ];

  protected readonly keyboardShortcuts: readonly PuiDocKeyboardShortcut[] = [
    { keys: ['Tab'], description: 'Move focus into and out of the input.' },
    { keys: ['Arrow keys'], description: 'Move caret within the text value.' },
  ];

  private isDocsTab(tab: string): tab is PuiDocsInputTab {
    return ['overview', 'examples', 'api', 'accessibility', 'theming', 'playground'].includes(tab);
  }
}

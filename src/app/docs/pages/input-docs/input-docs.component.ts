import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { map } from 'rxjs';
import { PuiInputComponent } from '../../../../premium-ui/components/input';
import type { PuiDocsTab } from '../../docs.types';
import type { PuiInputType } from '../../../../premium-ui/components/input';
import type { PuiSize } from '../../../../premium-ui/types/common.types';

type PuiDocsInputTab = 'overview' | 'examples' | 'api' | 'accessibility' | 'theming' | 'playground';

interface PuiApiRow {
  readonly name: string;
  readonly type: string;
  readonly defaultValue: string;
  readonly description: string;
}

@Component({
  selector: 'app-input-docs',
  imports: [PuiInputComponent, RouterLink, RouterLinkActive],
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

  protected readonly inputTypes: readonly PuiInputType[] = ['text', 'email', 'password', 'search', 'tel', 'url', 'number'];
  protected readonly sizes: readonly PuiSize[] = ['sm', 'md', 'lg'];

  protected readonly apiRows: readonly PuiApiRow[] = [
    { name: 'type', type: 'PuiInputType', defaultValue: 'text', description: 'Sets the native input type.' },
    { name: 'size', type: 'PuiSize', defaultValue: 'md', description: 'Controls the input height and font size.' },
    { name: 'placeholder', type: 'string | null', defaultValue: 'null', description: 'Text shown when the field is empty.' },
    { name: 'ariaLabel', type: 'string | null', defaultValue: 'null', description: 'Accessible label for the input when needed.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables user interaction.' },
    { name: 'readOnly', type: 'boolean', defaultValue: 'false', description: 'Makes the input read-only.' }
  ];

  protected readonly themeCode = `:root {
  --pui-input-background: #ffffff;
  --pui-input-border: #d1d5db;
  --pui-input-border-hover: #6366f1;
}`;

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

  protected copyCode(code: string): void {
    void navigator.clipboard?.writeText(code);
  }

  protected updateType(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as PuiInputType;
    this.playgroundType.set(value);
  }

  protected updateSize(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as PuiSize;
    this.playgroundSize.set(value);
  }

  protected updatePlaceholder(event: Event): void {
    this.playgroundPlaceholder.set((event.target as HTMLInputElement).value);
  }

  protected updateDisabled(event: Event): void {
    this.playgroundDisabled.set((event.target as HTMLInputElement).checked);
  }

  protected updateReadOnly(event: Event): void {
    this.playgroundReadOnly.set((event.target as HTMLInputElement).checked);
  }

  private isDocsTab(tab: string): tab is PuiDocsInputTab {
    return ['overview', 'examples', 'api', 'accessibility', 'theming', 'playground'].includes(tab);
  }
}

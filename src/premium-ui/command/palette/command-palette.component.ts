import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  TemplateRef,
  booleanAttribute,
  computed,
  contentChild,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { PUI_KEYS } from '../../internal/keyboard/keys.constants';
import { createPuiId } from '../../internal/utilities/id.utils';
import {
  PUI_COMMAND_DEFAULT_PALETTE_CONFIG,
  type PuiCommand,
  type PuiCommandPaletteConfig,
} from '../registry/command.types';
import { PuiCommandService } from '../services/command.service';
import { PuiCommandPaletteService } from '../services/command-palette.service';
import { resolveCommandIconPaths } from './command-icons';
import { PUI_COMMAND_PALETTE_CONFIG, PUI_COMMAND_PALETTE_ITEM_TEMPLATE } from './command-palette.tokens';
import { PuiCommandItemTemplateDirective } from '../directives/command-item-template.directive';

@Component({
  selector: 'pui-command-palette',
  imports: [NgTemplateOutlet],
  templateUrl: './command-palette.component.html',
  styleUrl: './command-palette.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PuiCommandPaletteComponent {
  private readonly commandService = inject(PuiCommandService);
  private readonly paletteService = inject(PuiCommandPaletteService);
  private readonly injectedConfig = inject(PUI_COMMAND_PALETTE_CONFIG, { optional: true });
  private readonly injectedTemplate = inject(PUI_COMMAND_PALETTE_ITEM_TEMPLATE, { optional: true });

  private readonly queryInput = viewChild<ElementRef<HTMLInputElement>>('queryInput');
  private readonly contentItemTemplate = contentChild(PuiCommandItemTemplateDirective);

  readonly ariaLabel = input('Command palette');
  readonly placeholder = input<string | null>(null);
  readonly emptyLabel = input<string | null>(null);
  readonly emptyDescription = input<string | null>(null);
  readonly maxResults = input<number | null>(null);
  readonly showRecent = input<boolean | null>(null);
  readonly recentLimit = input<number | null>(null);
  readonly fuzzy = input<boolean | null>(null);
  readonly useWorker = input(false, { transform: booleanAttribute });

  readonly query = signal('');
  readonly activeIndex = signal(0);

  protected readonly listboxId = createPuiId('pui-command-palette-listbox');

  protected readonly resolvedConfig = computed<Required<PuiCommandPaletteConfig>>(() => ({
    maxResults: this.maxResults() ?? this.injectedConfig?.maxResults ?? PUI_COMMAND_DEFAULT_PALETTE_CONFIG.maxResults,
    showRecent: this.showRecent() ?? this.injectedConfig?.showRecent ?? PUI_COMMAND_DEFAULT_PALETTE_CONFIG.showRecent,
    recentLimit: this.recentLimit() ?? this.injectedConfig?.recentLimit ?? PUI_COMMAND_DEFAULT_PALETTE_CONFIG.recentLimit,
    fuzzy: this.fuzzy() ?? this.injectedConfig?.fuzzy ?? PUI_COMMAND_DEFAULT_PALETTE_CONFIG.fuzzy,
    useWorker: this.useWorker() || (this.injectedConfig?.useWorker ?? PUI_COMMAND_DEFAULT_PALETTE_CONFIG.useWorker),
    placeholder: this.placeholder() ?? this.injectedConfig?.placeholder ?? PUI_COMMAND_DEFAULT_PALETTE_CONFIG.placeholder,
    emptyLabel: this.emptyLabel() ?? this.injectedConfig?.emptyLabel ?? PUI_COMMAND_DEFAULT_PALETTE_CONFIG.emptyLabel,
    emptyDescription:
      this.emptyDescription() ??
      this.injectedConfig?.emptyDescription ??
      PUI_COMMAND_DEFAULT_PALETTE_CONFIG.emptyDescription,
    animation: this.injectedConfig?.animation ?? PUI_COMMAND_DEFAULT_PALETTE_CONFIG.animation,
    positionAtCursor: this.injectedConfig?.positionAtCursor ?? PUI_COMMAND_DEFAULT_PALETTE_CONFIG.positionAtCursor,
  }));

  protected readonly groupedCommands = computed(() =>
    this.commandService.resolveGroupedCommands({
      query: this.query(),
      maxResults: this.resolvedConfig().maxResults,
      fuzzy: this.resolvedConfig().fuzzy,
      showRecent: this.resolvedConfig().showRecent,
      recentLimit: this.resolvedConfig().recentLimit,
      useWorker: this.resolvedConfig().useWorker,
      includeDisabled: true,
    })
  );

  protected readonly flatCommands = computed(() =>
    this.groupedCommands().flatMap((group) => group.commands)
  );

  protected readonly activeCommandId = computed(() => {
    const commands = this.flatCommands();
    return commands[this.activeIndex()]?.id ?? null;
  });

  protected readonly activeOptionId = computed(() => {
    const id = this.activeCommandId();
    return id ? this.optionId(id) : null;
  });

  protected readonly itemTemplate = computed(() => {
    const content = this.contentItemTemplate()?.templateRef;
    return content ?? this.injectedTemplate ?? null;
  });

  constructor() {
    effect(() => {
      this.query();
      this.activeIndex.set(0);
    });

    effect(() => {
      const commands = this.flatCommands();
      if (this.activeIndex() >= commands.length) {
        this.activeIndex.set(Math.max(0, commands.length - 1));
      }
    });

    effect(() => {
      if (this.resolvedConfig().useWorker) {
        void this.commandService.searchAsync({
          query: this.query(),
          maxResults: this.resolvedConfig().maxResults,
          fuzzy: this.resolvedConfig().fuzzy,
          useWorker: true,
          includeDisabled: true,
        });
      }
    });
  }

  protected handleQueryInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.query.set(value);
  }

  protected handleKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case PUI_KEYS.ARROW_DOWN:
        event.preventDefault();
        this.moveActive(1);
        break;
      case PUI_KEYS.ARROW_UP:
        event.preventDefault();
        this.moveActive(-1);
        break;
      case PUI_KEYS.HOME:
        event.preventDefault();
        this.activeIndex.set(0);
        this.scrollActiveIntoView();
        break;
      case PUI_KEYS.END:
        event.preventDefault();
        this.activeIndex.set(Math.max(0, this.flatCommands().length - 1));
        this.scrollActiveIntoView();
        break;
      case PUI_KEYS.ENTER:
        event.preventDefault();
        void this.executeActive();
        break;
      case PUI_KEYS.ESCAPE:
        event.preventDefault();
        this.paletteService.close();
        break;
      case PUI_KEYS.TAB:
        event.preventDefault();
        break;
      default:
        break;
    }
  }

  protected handleOptionMouseDown(event: MouseEvent, commandId: string): void {
    event.preventDefault();
    this.setActiveById(commandId);
    void this.execute(commandId);
  }

  protected setActiveById(commandId: string): void {
    const index = this.flatCommands().findIndex((command) => command.id === commandId);
    if (index >= 0) {
      this.activeIndex.set(index);
    }
  }

  protected isActive(commandId: string): boolean {
    return this.activeCommandId() === commandId;
  }

  protected iconPaths(icon?: string): readonly string[] {
    return resolveCommandIconPaths(icon);
  }

  protected optionId(commandId: string): string {
    return `${this.listboxId}-option-${commandId}`;
  }

  protected groupLabelId(groupId: string): string {
    return `${this.listboxId}-group-${groupId}`;
  }

  private moveActive(delta: number): void {
    const length = this.flatCommands().length;
    if (length === 0) {
      return;
    }

    const next = (this.activeIndex() + delta + length) % length;
    this.activeIndex.set(next);
    this.scrollActiveIntoView();
  }

  private scrollActiveIntoView(): void {
    queueMicrotask(() => {
      const id = this.activeOptionId();
      if (!id) {
        return;
      }

      document.getElementById(id)?.scrollIntoView({ block: 'nearest' });
    });
  }

  private async executeActive(): Promise<void> {
    const id = this.activeCommandId();
    if (!id) {
      return;
    }

    await this.execute(id);
  }

  private async execute(commandId: string): Promise<void> {
    const result = await this.commandService.execute(commandId);

    if (result === 'success') {
      this.paletteService.close();
    }
  }

  focusInput(): void {
    this.queryInput()?.nativeElement.focus();
  }
}

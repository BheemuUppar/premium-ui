import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  TemplateRef,
  booleanAttribute,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import type { PuiTableExportFormat } from '../interfaces';

const EXPORT_LABELS: Readonly<Record<PuiTableExportFormat, string>> = {
  csv: 'CSV',
  excel: 'Excel',
  json: 'JSON',
  pdf: 'PDF',
};

@Component({
  selector: 'pui-table-toolbar',
  imports: [NgTemplateOutlet],
  templateUrl: './table-toolbar.component.html',
  styleUrl: './table-toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PuiTableToolbarComponent {
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly searchQuery = input('');
  readonly searchPlaceholder = input('Search rows…');
  readonly showSearch = input(true, { transform: booleanAttribute });
  readonly showExport = input(true, { transform: booleanAttribute });
  readonly exportFormats = input<readonly PuiTableExportFormat[]>([]);
  readonly centerTemplate = input<TemplateRef<unknown> | null>(null);

  readonly input = output<string>();
  readonly exportClick = output<PuiTableExportFormat>();

  protected readonly exportMenuOpen = signal(false);

  protected readonly showExportMenu = computed(
    () => this.showExport() && this.exportFormats().length > 0
  );

  protected exportLabel(format: PuiTableExportFormat): string {
    return EXPORT_LABELS[format];
  }

  protected onSearchInput(event: Event): void {
    this.input.emit((event.target as HTMLInputElement).value);
  }

  protected toggleExportMenu(event: Event): void {
    event.stopPropagation();
    this.exportMenuOpen.update((open) => !open);
  }

  protected onExportTriggerKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown' && !this.exportMenuOpen()) {
      event.preventDefault();
      this.exportMenuOpen.set(true);
    }
  }

  protected selectExport(format: PuiTableExportFormat, event: Event): void {
    event.stopPropagation();
    this.exportMenuOpen.set(false);
    this.exportClick.emit(format);
  }

  @HostListener('document:click', ['$event'])
  protected closeExportMenu(event: MouseEvent): void {
    if (!this.host.nativeElement.contains(event.target as Node)) {
      this.exportMenuOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  protected closeExportMenuOnEscape(): void {
    this.exportMenuOpen.set(false);
  }
}

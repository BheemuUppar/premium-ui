import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

function formatDocOutput(value: unknown): string {
  if (value == null) {
    return 'null';
  }
  if (value instanceof Date) {
    return JSON.stringify(value.toISOString(), null, 2);
  }
  if (typeof value === 'bigint') {
    return value.toString();
  }
  try {
    return JSON.stringify(
      value,
      (_key, current) => {
        if (current instanceof Date) {
          return current.toISOString();
        }
        return current;
      },
      2
    );
  } catch {
    return String(value);
  }
}

@Component({
  selector: 'pui-doc-output-viewer',
  templateUrl: './doc-output-viewer.component.html',
  styleUrl: './doc-output-viewer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PuiDocOutputViewerComponent {
  readonly label = input('Selected Value');
  readonly value = input<unknown>(null);
  readonly collapsed = input(false);

  protected readonly expanded = signal(true);
  protected readonly copied = signal(false);

  protected readonly formatted = computed(() => formatDocOutput(this.value()));
  protected readonly isCollapsed = computed(() => this.collapsed() && !this.expanded());

  protected toggleExpanded(): void {
    this.expanded.update((state) => !state);
  }

  protected async copyValue(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.formatted());
      this.copied.set(true);
      window.setTimeout(() => this.copied.set(false), 1500);
    } catch {
      this.copied.set(false);
    }
  }
}

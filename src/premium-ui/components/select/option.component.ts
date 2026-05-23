import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  booleanAttribute,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';

@Component({
  selector: 'pui-option',
  template: '<span class="pui-option__content"><ng-content /></span>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'pui-option',
    '[attr.hidden]': 'true',
    style: 'display: none',
    'aria-hidden': 'true',
  },
})
export class PuiOptionComponent {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly contentLabel = signal('');

  readonly value = input.required<string | number>();
  readonly label = input<string>('');
  readonly disabled = input(false, { transform: booleanAttribute });

  readonly resolvedLabel = computed(() => {
    const explicit = this.label().trim();
    if (explicit) {
      return explicit;
    }

    const projected = this.contentLabel().trim();
    if (projected) {
      return projected;
    }

    return String(this.value());
  });

  constructor() {
    afterNextRender(() => {
      this.syncContentLabel();
    });
  }

  private syncContentLabel(): void {
    const next = this.readContentLabel();
    if (next !== this.contentLabel()) {
      this.contentLabel.set(next);
    }
  }

  private readContentLabel(): string {
    const content = this.elementRef.nativeElement.querySelector('.pui-option__content');
    return content?.textContent?.trim() ?? this.elementRef.nativeElement.textContent?.trim() ?? '';
  }
}

import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, PLATFORM_ID, afterNextRender, inject, input, signal } from '@angular/core';
import type { PuiDocsTocItem } from '../docs.types';

@Component({
  selector: 'app-docs-toc',
  templateUrl: './docs-toc.component.html',
  styleUrl: './docs-toc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocsTocComponent {
  readonly items = input.required<readonly PuiDocsTocItem[]>();

  protected readonly activeId = signal<string | null>(null);

  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  constructor() {
    afterNextRender(() => this.observeSections());
  }

  protected isActive(id: string): boolean {
    return this.activeId() === id;
  }

  private observeSections(): void {
    if (!isPlatformBrowser(this.platformId) || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const sections = this.items()
      .map((item) => this.document.getElementById(item.id))
      .filter((section): section is HTMLElement => section !== null);

    if (sections.length === 0) {
      return;
    }

    this.activeId.set(sections[0].id);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => first.boundingClientRect.top - second.boundingClientRect.top)[0];

        if (visibleEntry?.target.id) {
          this.activeId.set(visibleEntry.target.id);
        }
      },
      {
        rootMargin: '-96px 0px -65% 0px',
        threshold: [0, 0.2, 0.6]
      }
    );

    sections.forEach((section) => observer.observe(section));
  }
}

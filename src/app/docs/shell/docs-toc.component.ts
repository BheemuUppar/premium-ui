import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  PLATFORM_ID,
  afterNextRender,
  effect,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { PuiDocsTocService } from '../services/docs-toc.service';

@Component({
  selector: 'app-docs-toc',
  templateUrl: './docs-toc.component.html',
  styleUrl: './docs-toc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsTocComponent {
  protected readonly tocService = inject(PuiDocsTocService);
  protected readonly activeId = signal<string | null>(null);
  protected readonly mobileOpen = signal(false);

  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private observer: IntersectionObserver | null = null;

  constructor() {
    afterNextRender(() => this.setupObserver());

    effect(() => {
      this.tocService.revision();
      this.setupObserver();
    });

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.activeId.set(null);
        this.setupObserver();
      });

    this.destroyRef.onDestroy(() => this.observer?.disconnect());
  }

  protected isActive(id: string): boolean {
    return this.activeId() === id;
  }

  protected toggleMobile(): void {
    this.mobileOpen.update((open) => !open);
  }

  protected navigateToSection(event: Event, id: string): void {
    event.preventDefault();
    const target = this.document.getElementById(id);
    if (!target) {
      return;
    }

    target.scrollIntoView({ behavior: 'smooth', block: 'start' });

    if (isPlatformBrowser(this.platformId)) {
      this.document.defaultView?.history.replaceState(null, '', `#${id}`);
    }

    this.activeId.set(id);
  }

  private setupObserver(): void {
    this.observer?.disconnect();
    this.observer = null;

    if (!isPlatformBrowser(this.platformId) || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const items = this.tocService.items();
    const sections = items
      .map((item) => this.document.getElementById(item.id))
      .filter((section): section is HTMLElement => section !== null);

    if (sections.length === 0) {
      this.activeId.set(null);
      return;
    }

    this.activeId.set(sections[0].id);

    this.observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]?.target.id) {
          this.activeId.set(visible[0].target.id);
          this.scrollActiveLinkIntoView(visible[0].target.id);
        }
      },
      {
        rootMargin: '-96px 0px -62% 0px',
        threshold: [0, 0.15, 0.4, 0.75],
      }
    );

    sections.forEach((section) => this.observer?.observe(section));
  }

  private scrollActiveLinkIntoView(id: string): void {
    const link = this.document.querySelector<HTMLElement>(`.pui-toc__link[data-toc-id="${id}"]`);
    link?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }
}

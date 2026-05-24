import { DestroyRef, effect, inject, type Signal } from '@angular/core';
import type { PuiDocBreadcrumb, PuiDocsTocItem } from '../docs.types';
import { PuiDocsTocService } from '../services/docs-toc.service';
import { getDocPageToc } from './docs-toc.registry';
import { PuiDocsSeoService } from './docs-seo.service';

export interface UseDocsPageSeoOptions {
  readonly slug: string;
  readonly tab: Signal<string>;
  readonly tocByTab?: Signal<Readonly<Record<string, readonly PuiDocsTocItem[]>>>;
  readonly breadcrumbs?: Signal<readonly PuiDocBreadcrumb[]>;
  /** When true (default), fall back to shared TOC registry per slug/tab. */
  readonly autoToc?: boolean;
}

/** Wire dynamic SEO metadata and optional TOC items to the active docs tab. */
export function useDocsPageSeo(options: UseDocsPageSeoOptions): void {
  const seo = inject(PuiDocsSeoService);
  const toc = inject(PuiDocsTocService);
  const destroyRef = inject(DestroyRef);
  const autoToc = options.autoToc ?? !options.tocByTab;

  effect(() => {
    const tab = options.tab();
    seo.applyComponentPage(options.slug, tab, options.breadcrumbs?.());
    const items =
      options.tocByTab?.()[tab] ?? (autoToc ? getDocPageToc(options.slug, tab) : []);
    toc.setItems(items);
  });

  destroyRef.onDestroy(() => {
    toc.clear();
    seo.clear();
  });
}

export function useFoundationPageSeo(section: Signal<string>): void {
  const seo = inject(PuiDocsSeoService);
  const toc = inject(PuiDocsTocService);
  const destroyRef = inject(DestroyRef);

  effect(() => {
    seo.applyFoundationPage(section());
    toc.clear();
  });

  destroyRef.onDestroy(() => {
    toc.clear();
    seo.clear();
  });
}

export function useComingSoonPageSeo(slug: Signal<string>, name: Signal<string>): void {
  const seo = inject(PuiDocsSeoService);
  const destroyRef = inject(DestroyRef);

  effect(() => {
    seo.applyComingSoon(slug(), name());
  });

  destroyRef.onDestroy(() => seo.clear());
}

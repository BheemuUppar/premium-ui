import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import type { PuiDocBreadcrumb } from '../docs.types';
import {
  PUI_DOCS_DEFAULT_DESCRIPTION,
  PUI_DOCS_DEFAULT_KEYWORDS,
  PUI_DOCS_DEFAULT_TITLE,
  PUI_DOCS_OG_IMAGE,
  PUI_DOCS_SITE_NAME,
  PUI_DOCS_SITE_URL,
  PUI_DOCS_TWITTER_HANDLE,
} from './docs-seo.constants';
import {
  DOCS_COMPONENT_SEO,
  resolveComponentSeo,
  resolveFoundationSeo,
} from './docs-seo.registry';
import type { PuiDocsJsonLdGraph, PuiDocsSeoContext } from './docs-seo.types';

const JSON_LD_ID = 'pui-docs-json-ld';
const CANONICAL_ID = 'pui-docs-canonical';

@Injectable({ providedIn: 'root' })
export class PuiDocsSeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  applyComponentPage(slug: string, tab: string, breadcrumbs?: readonly PuiDocBreadcrumb[]): void {
    const component = resolveComponentSeo(slug);
    const tabMeta = component?.tabs[tab] ?? component?.tabs['overview'];

    if (!component || !tabMeta) {
      this.applyDefaults();
      return;
    }

    const path = `/docs/components/${slug}/${tab}`;
    this.applyMeta({
      slug,
      tab,
      path,
      breadcrumbs,
      title: `${tabMeta.title} | ${PUI_DOCS_SITE_NAME}`,
      description: tabMeta.description,
      keywords: component.keywords,
      noindex: false,
      jsonLdName: component.name,
    });
  }

  applyFoundationPage(section: string): void {
    const meta = resolveFoundationSeo(section);

    if (!meta) {
      this.applyDefaults();
      return;
    }

    const path = `/docs/foundations/${section}`;
    this.applyMeta({
      slug: section,
      tab: section,
      path,
      title: `${meta.title} | ${PUI_DOCS_SITE_NAME}`,
      description: meta.description,
      keywords: PUI_DOCS_DEFAULT_KEYWORDS,
      noindex: false,
      jsonLdName: meta.title,
    });
  }

  applyComingSoon(componentSlug: string, componentName: string): void {
    const path = `/docs/components/${componentSlug}`;
    this.applyMeta({
      slug: componentSlug,
      tab: 'coming-soon',
      path,
      title: `${componentName} (Coming Soon) | ${PUI_DOCS_SITE_NAME}`,
      description: `${componentName} documentation is coming soon to Premium UI — an accessible Angular design system.`,
      keywords: PUI_DOCS_DEFAULT_KEYWORDS,
      noindex: true,
      jsonLdName: componentName,
    });
  }

  clear(): void {
    this.removeJsonLd();
    this.removeCanonical();
  }

  private applyDefaults(): void {
    this.applyMeta({
      slug: '',
      tab: '',
      path: '/docs',
      title: PUI_DOCS_DEFAULT_TITLE,
      description: PUI_DOCS_DEFAULT_DESCRIPTION,
      keywords: PUI_DOCS_DEFAULT_KEYWORDS,
      noindex: false,
      jsonLdName: PUI_DOCS_SITE_NAME,
    });
  }

  private applyMeta(options: {
    readonly slug: string;
    readonly tab: string;
    readonly path: string;
    readonly title: string;
    readonly description: string;
    readonly keywords: string;
    readonly noindex: boolean;
    readonly jsonLdName: string;
    readonly breadcrumbs?: readonly PuiDocBreadcrumb[];
  }): void {
    this.title.setTitle(options.title);

    this.setMetaTag('name', 'description', options.description);
    this.setMetaTag('name', 'keywords', options.keywords);
    this.setMetaTag('name', 'robots', options.noindex ? 'noindex, nofollow' : 'index, follow');

    const canonicalUrl = this.buildAbsoluteUrl(options.path);
    this.setCanonical(canonicalUrl);

    this.setMetaTag('property', 'og:title', options.title);
    this.setMetaTag('property', 'og:description', options.description);
    this.setMetaTag('property', 'og:url', canonicalUrl);
    this.setMetaTag('property', 'og:type', 'article');
    this.setMetaTag('property', 'og:site_name', PUI_DOCS_SITE_NAME);
    this.setMetaTag('property', 'og:image', this.buildAbsoluteUrl(PUI_DOCS_OG_IMAGE));

    this.setMetaTag('name', 'twitter:card', 'summary_large_image');
    this.setMetaTag('name', 'twitter:site', PUI_DOCS_TWITTER_HANDLE);
    this.setMetaTag('name', 'twitter:title', options.title);
    this.setMetaTag('name', 'twitter:description', options.description);
    this.setMetaTag('name', 'twitter:image', this.buildAbsoluteUrl(PUI_DOCS_OG_IMAGE));

    this.injectJsonLd(this.buildJsonLd(options, canonicalUrl));
  }

  private buildJsonLd(
    options: {
      readonly title: string;
      readonly description: string;
      readonly jsonLdName: string;
      readonly breadcrumbs?: readonly PuiDocBreadcrumb[];
    },
    canonicalUrl: string
  ): PuiDocsJsonLdGraph {
    const graph: Record<string, unknown>[] = [
      {
        '@type': 'WebSite',
        '@id': `${PUI_DOCS_SITE_URL}/#website`,
        name: PUI_DOCS_SITE_NAME,
        url: PUI_DOCS_SITE_URL,
        description: PUI_DOCS_DEFAULT_DESCRIPTION,
        inLanguage: 'en-US',
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${PUI_DOCS_SITE_URL}/#software`,
        name: PUI_DOCS_SITE_NAME,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
      {
        '@type': 'TechArticle',
        '@id': `${canonicalUrl}#article`,
        headline: options.title,
        description: options.description,
        url: canonicalUrl,
        author: { '@type': 'Organization', name: PUI_DOCS_SITE_NAME },
        publisher: { '@type': 'Organization', name: PUI_DOCS_SITE_NAME },
        inLanguage: 'en-US',
        about: { '@type': 'SoftwareApplication', name: options.jsonLdName },
      },
    ];

    const breadcrumbItems = this.buildBreadcrumbList(options.breadcrumbs, options.title, canonicalUrl);
    if (breadcrumbItems) {
      graph.push(breadcrumbItems);
    }

    return { '@context': 'https://schema.org', '@graph': graph };
  }

  private buildBreadcrumbList(
    breadcrumbs: readonly PuiDocBreadcrumb[] | undefined,
    pageTitle: string,
    canonicalUrl: string
  ): Record<string, unknown> | null {
    const crumbs = breadcrumbs?.length
      ? breadcrumbs
      : [{ label: 'Docs' }, { label: pageTitle }];

    return {
      '@type': 'BreadcrumbList',
      '@id': `${canonicalUrl}#breadcrumb`,
      itemListElement: crumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.label,
        ...(crumb.route ? { item: this.buildAbsoluteUrl(crumb.route.join('/').replace(/^\//, '/')) } : {}),
      })),
    };
  }

  private buildAbsoluteUrl(path: string): string {
    const normalized = path.startsWith('/') ? path : `/${path}`;
    if (isPlatformBrowser(this.platformId) && typeof this.document.defaultView?.location?.origin === 'string') {
      return `${this.document.defaultView.location.origin}${normalized}`;
    }
    return `${PUI_DOCS_SITE_URL}${normalized}`;
  }

  private setMetaTag(attr: 'name' | 'property', selector: string, content: string): void {
    this.meta.updateTag({ [attr]: selector, content });
  }

  private setCanonical(url: string): void {
    const head = this.document.head;
    let link = this.document.getElementById(CANONICAL_ID) as HTMLLinkElement | null;

    if (!link) {
      link = this.document.createElement('link');
      link.id = CANONICAL_ID;
      link.rel = 'canonical';
      head.appendChild(link);
    }

    link.href = url;
  }

  private removeCanonical(): void {
    this.document.getElementById(CANONICAL_ID)?.remove();
  }

  private injectJsonLd(data: PuiDocsJsonLdGraph): void {
    this.removeJsonLd();
    const script = this.document.createElement('script');
    script.id = JSON_LD_ID;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    this.document.head.appendChild(script);
  }

  private removeJsonLd(): void {
    this.document.getElementById(JSON_LD_ID)?.remove();
  }
}

export function getRelatedLinks(slug: string) {
  return DOCS_COMPONENT_SEO[slug]?.relatedLinks ?? [];
}

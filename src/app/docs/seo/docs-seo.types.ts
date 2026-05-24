import type { PuiDocBreadcrumb } from '../docs.types';

export interface PuiDocsSeoTabMeta {
  readonly title: string;
  readonly description: string;
  readonly keywords?: string;
}

export interface PuiDocsComponentSeo {
  readonly slug: string;
  readonly name: string;
  readonly titlePrefix: string;
  readonly keywords: string;
  readonly tabs: Readonly<Record<string, PuiDocsSeoTabMeta>>;
  readonly relatedLinks?: readonly PuiDocsRelatedLink[];
}

export interface PuiDocsRelatedLink {
  readonly label: string;
  readonly route: readonly string[];
  readonly description?: string;
}

export interface PuiDocsSeoContext {
  readonly slug: string;
  readonly tab: string;
  readonly path: string;
  readonly breadcrumbs?: readonly PuiDocBreadcrumb[];
  readonly noindex?: boolean;
}

export interface PuiDocsJsonLdGraph {
  readonly '@context': 'https://schema.org';
  readonly '@graph': readonly Record<string, unknown>[];
}

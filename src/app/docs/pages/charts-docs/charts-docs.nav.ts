import type { PuiDocsNavItem } from '../../docs.types';
import { CHART_DOC_PAGES } from './charts-docs.registry';

/** Doc section slugs (platform guides — not individual chart types). */
export const CHARTS_DOC_SLUGS = [
  'doc',
  'overview',
  'api',
  'accessibility',
  'theming',
  'playground',
] as const;

export type PuiChartsDocSlug = (typeof CHARTS_DOC_SLUGS)[number];

export const CHARTS_DOC_TABS: readonly { readonly label: string; readonly slug: PuiChartsDocSlug }[] = [
  { label: 'Overview', slug: 'doc' },
  { label: 'API', slug: 'api' },
  { label: 'Accessibility', slug: 'accessibility' },
  { label: 'Theming', slug: 'theming' },
  { label: 'Playground', slug: 'playground' },
];

/** Sidebar tree under the Charts group. */
export const CHARTS_SIDEBAR_ITEMS: readonly PuiDocsNavItem[] = [
  { label: 'Documentation', route: ['/docs/components/charts/doc'], badge: 'Ready' },
  { label: 'Configuration Playground', route: ['/docs/components/charts/configuration-playground'] },
  ...CHART_DOC_PAGES.map((page) => ({
    label: page.title,
    route: [`/docs/components/charts/${page.slug}`] as const,
  })),
];

export const CHART_TYPE_SLUGS = CHART_DOC_PAGES.map((page) => page.slug);

export function isChartTypeSlug(slug: string | null): slug is string {
  return slug != null && CHART_TYPE_SLUGS.includes(slug);
}

export function isChartsDocSlug(slug: string | null): slug is PuiChartsDocSlug {
  return slug != null && (CHARTS_DOC_SLUGS as readonly string[]).includes(slug);
}

/** Maps route slug to SEO / in-page doc tab id. */
export function resolveChartsDocTab(slug: string | null): string {
  if (slug === 'doc' || slug === 'overview' || slug == null) {
    return 'overview';
  }
  if (slug === 'api' || slug === 'accessibility' || slug === 'theming' || slug === 'playground') {
    return slug;
  }
  return 'overview';
}

export function chartsRoute(slug: string): readonly string[] {
  return [`/docs/components/charts/${slug}`];
}

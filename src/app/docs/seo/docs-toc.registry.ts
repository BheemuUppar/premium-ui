import type { PuiDocsTocItem } from '../docs.types';

type TocMap = Readonly<Record<string, readonly PuiDocsTocItem[]>>;

const standardTabs = (sections: readonly PuiDocsTocItem[]): TocMap => ({
  overview: sections,
  examples: [{ id: 'variants', label: 'Variants' }, { id: 'states', label: 'States' }],
  api: [{ id: 'api', label: 'API reference' }],
  accessibility: [
    { id: 'accessibility', label: 'Keyboard & screen readers' },
  ],
  theming: [{ id: 'states', label: 'CSS variables' }],
  playground: [{ id: 'playground', label: 'Live playground' }],
});

export const DOC_PAGE_TOC: Readonly<Record<string, TocMap>> = {
  button: standardTabs([
    { id: 'basic-usage', label: 'Overview' },
    { id: 'variants', label: 'Examples' },
  ]),
  input: standardTabs([
    { id: 'overview', label: 'Overview' },
    { id: 'basic-usage', label: 'Basic usage' },
  ]),
  card: standardTabs([
    { id: 'overview', label: 'Architecture' },
    { id: 'composition', label: 'Composition' },
  ]),
  select: standardTabs([
    { id: 'overview', label: 'Overview' },
    { id: 'basic-usage', label: 'Basic usage' },
  ]),
  checkbox: standardTabs([
    { id: 'overview', label: 'Overview' },
    { id: 'basic-usage', label: 'Basic usage' },
  ]),
  radio: standardTabs([
    { id: 'overview', label: 'Overview' },
    { id: 'basic-usage', label: 'Basic usage' },
  ]),
  switch: standardTabs([
    { id: 'overview', label: 'Overview' },
    { id: 'basic-usage', label: 'Basic usage' },
  ]),
  toggle: standardTabs([
    { id: 'overview', label: 'Overview' },
    { id: 'basic-usage', label: 'Basic usage' },
  ]),
  tabs: {
    overview: [
      { id: 'overview', label: 'Overview' },
      { id: 'basic-usage', label: 'Basic usage' },
    ],
    variants: [{ id: 'variants', label: 'Variants' }],
    examples: [{ id: 'examples', label: 'Examples' }],
    api: [{ id: 'api', label: 'API reference' }],
    accessibility: [{ id: 'accessibility', label: 'Accessibility' }],
    theming: [{ id: 'theming', label: 'Theming' }],
    keyboard: [{ id: 'keyboard', label: 'Keyboard' }],
    playground: [{ id: 'playground', label: 'Playground' }],
  },
  toast: standardTabs([
    { id: 'overview', label: 'Overview' },
    { id: 'variants', label: 'Examples' },
  ]),
};

export function getDocPageToc(slug: string, tab: string): readonly PuiDocsTocItem[] {
  return DOC_PAGE_TOC[slug]?.[tab] ?? [];
}

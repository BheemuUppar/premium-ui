import type { PuiSelectOption } from './select.types';

export const BASIC_OPTIONS: readonly PuiSelectOption[] = [
  { label: 'React', value: 'react' },
  { label: 'Angular', value: 'angular' },
  { label: 'Vue', value: 'vue' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Solid', value: 'solid' },
];

export const FRAMEWORK_OPTIONS: readonly PuiSelectOption[] = [
  { label: 'React', value: 'react' },
  { label: 'Angular', value: 'angular' },
  { label: 'Vue', value: 'vue' },
  { label: 'Svelte', value: 'svelte', disabled: true },
  { label: 'Ember', value: 'ember', disabled: true },
  { label: 'Solid', value: 'solid' },
  { label: 'Qwik', value: 'qwik' },
  { label: 'Preact', value: 'preact' },
];

export const COUNTRY_OPTIONS: readonly PuiSelectOption[] = [
  { label: 'United States', value: 'us' },
  { label: 'United Kingdom', value: 'uk' },
  { label: 'Canada', value: 'ca' },
  { label: 'Germany', value: 'de' },
  { label: 'France', value: 'fr' },
  { label: 'Japan', value: 'jp' },
  { label: 'Australia', value: 'au' },
  { label: 'Brazil', value: 'br' },
];

export function createLargeDataset(count = 10000): PuiSelectOption[] {
  return Array.from({ length: count }, (_, index) => ({
    label: `Option ${index + 1}`,
    value: index + 1,
  }));
}

export const LARGE_DATASET = createLargeDataset(10000);

export const STORY_LAYOUT = `
  display: flex;
  flex-direction: column;
  gap: var(--pui-space-md);
  width: min(28rem, 100%);
`;

export const STORY_GRID = `
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: var(--pui-space-lg);
`;

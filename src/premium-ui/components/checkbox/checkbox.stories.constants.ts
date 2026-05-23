export const STORY_GRID = `
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
  gap: var(--pui-space-lg);
`;

export const STORY_STACK = `
  display: flex;
  flex-direction: column;
  gap: var(--pui-space-md);
`;

export const FRAMEWORKS = ['angular', 'react', 'vue', 'svelte'] as const;

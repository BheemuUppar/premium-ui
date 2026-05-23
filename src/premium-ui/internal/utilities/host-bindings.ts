/** Standard size host bindings for Premium UI components. */
export function createSizeHostBindings(prefix: string): Record<string, string> {
  return {
    [`[class.${prefix}--sm]`]: "size() === 'sm'",
    [`[class.${prefix}--md]`]: "size() === 'md'",
    [`[class.${prefix}--lg]`]: "size() === 'lg'",
  };
}

/** Standard disabled host binding. */
export function createDisabledHostBinding(prefix: string): Record<string, string> {
  return {
    [`[class.${prefix}--disabled]`]: 'isDisabled()',
  };
}

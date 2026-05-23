/** Focuses element when present; safe no-op for SSR/disconnected nodes. */
export function focusElement(element: HTMLElement | null | undefined): void {
  element?.focus();
}

/** Moves focus without scrolling the page. */
export function focusElementWithoutScroll(element: HTMLElement | null | undefined): void {
  element?.focus({ preventScroll: true });
}

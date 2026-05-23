/** Scroll lock utilities for overlays (dialog, dropdown). */
export function lockBodyScroll(): void {
  document.body.style.overflow = 'hidden';
}

export function unlockBodyScroll(): void {
  document.body.style.overflow = '';
}

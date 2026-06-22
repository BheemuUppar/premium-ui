/** Closes the overlay when focus leaves the trigger and panel (Tab away). Returns cleanup. */
export function monitorOverlayFocusDismiss(options: {
  readonly trigger: HTMLElement;
  readonly getPanel: () => HTMLElement | null | undefined;
  readonly isOpen: () => boolean;
  readonly onDismiss: () => void;
}): () => void {
  const onFocusIn = (): void => {
    queueMicrotask(() => {
      if (!options.isOpen()) {
        return;
      }

      const active = document.activeElement;
      const panel = options.getPanel();

      if (options.trigger.contains(active) || panel?.contains(active)) {
        return;
      }

      options.onDismiss();
    });
  };

  document.addEventListener('focusin', onFocusIn);

  return () => {
    document.removeEventListener('focusin', onFocusIn);
  };
}

/** Returns true when focus moved into the overlay panel from the trigger field. */
export function isFocusMovingToOverlay(event: FocusEvent, panel: HTMLElement | null | undefined): boolean {
  const related = event.relatedTarget;
  return related instanceof Node && panel != null && panel.contains(related);
}

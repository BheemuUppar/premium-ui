import { FocusTrap, FocusTrapFactory } from '@angular/cdk/a11y';
import { focusElementWithoutScroll } from './focus.utils';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function queryFocusableElements(root: HTMLElement): readonly HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)].filter(
    (element) => !element.hasAttribute('disabled') && element.tabIndex !== -1
  );
}

export function focusFirstFocusable(root: HTMLElement | null | undefined): void {
  if (!root) {
    return;
  }

  const [first] = queryFocusableElements(root);
  focusElementWithoutScroll(first ?? root);
}

export function createFocusTrap(
  factory: FocusTrapFactory,
  element: HTMLElement,
  deferCaptureElements = false
): FocusTrap {
  return factory.create(element, deferCaptureElements);
}

interface PuiScrollLockSnapshot {
  readonly htmlOverflow: string;
  readonly bodyOverflow: string;
  readonly bodyPaddingRight: string;
}

let lockCount = 0;
let snapshot: PuiScrollLockSnapshot | null = null;

function getScrollbarWidth(): number {
  return Math.max(0, window.innerWidth - document.documentElement.clientWidth);
}

/** Reference-counted scroll lock for stacked overlays. */
export function lockBodyScroll(): void {
  if (typeof document === 'undefined') {
    return;
  }

  if (lockCount === 0) {
    const { documentElement: html, body } = document;
    const scrollbarWidth = getScrollbarWidth();
    const bodyPaddingRight = body.style.paddingRight;
    const currentBodyPadding = Number.parseFloat(getComputedStyle(body).paddingRight) || 0;

    snapshot = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyPaddingRight,
    };

    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${currentBodyPadding + scrollbarWidth}px`;
    }

    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
  }

  lockCount += 1;
}

export function unlockBodyScroll(): void {
  if (typeof document === 'undefined') {
    return;
  }

  lockCount = Math.max(0, lockCount - 1);

  if (lockCount === 0 && snapshot) {
    const { documentElement: html, body } = document;

    html.style.overflow = snapshot.htmlOverflow;
    body.style.overflow = snapshot.bodyOverflow;
    body.style.paddingRight = snapshot.bodyPaddingRight;
    snapshot = null;
  }
}

export function resetBodyScrollLock(): void {
  if (typeof document === 'undefined') {
    return;
  }

  if (snapshot) {
    const { documentElement: html, body } = document;

    html.style.overflow = snapshot.htmlOverflow;
    body.style.overflow = snapshot.bodyOverflow;
    body.style.paddingRight = snapshot.bodyPaddingRight;
    snapshot = null;
  }

  lockCount = 0;
}

# Dialog System Architecture Audit

**Date:** 2026-06-06  
**Scope:** `src/premium-ui/overlay/`, `src/premium-ui/components/dialog/`  
**Goal:** Stabilize before feature expansion.

---

## Executive Summary

The dialog system has **two competing overlay attachment strategies** (CDK `OverlayRef.attach()` vs manual `createComponent` on the pane). The dialog path uses the manual strategy exclusively, leaving dead code and incomplete lifecycle cleanup. Several issues explain reported failures: **close buttons not firing**, **component dialogs not opening**, and **stacked dialogs misbehaving**.

| Area | Status | Severity |
|------|--------|----------|
| Overlay creation | ⚠️ Partial | Medium |
| Portal attachment | ✅ Fixed (CDK attach) | — |
| Template dialogs | ⚠️ Fragile | High |
| Component dialogs | ⚠️ Fragile | High |
| Dialog service | ⚠️ Partial | High |
| Dialog ref | ✅ Mostly OK | Low |
| Backdrop clicks | ⚠️ Partial | Medium |
| Close buttons | ✅ Fixed | — |
| Escape key | ⚠️ Partial | Medium |
| Focus trapping | ⚠️ Partial | Medium |
| Body scroll lock | ✅ OK | Low |
| Z-index / stacking | ⚠️ Partial | Medium |
| Overlay cleanup | ✅ Fixed | — |

---

## Open Flow Trace

```
PuiDialogService.open(content, config?, vcr?)
  ├─ resolveDialogConfig(config)
  ├─ PuiOverlayService.create(resolved)
  │    ├─ isPlatformBrowser? → null on SSR
  │    ├─ lockBodyScroll() if scrollStrategy=block
  │    ├─ Overlay.create(OverlayConfig)          ← CDK overlay + pane created
  │    ├─ new PuiOverlayRef(cdkRef, onDispose)
  │    ├─ stack.push(ref) → zIndex
  │    ├─ overlayElement.style.zIndex = zIndex
  │    ├─ pane inline size styles
  │    ├─ backdrop zIndex = zIndex - 1
  │    └─ backdrop + escape subscriptions (topmost only)
  ├─ new PuiDialogRef(overlayRef, onClose)
  ├─ openRefs.push(dialogRef)                    ← ISSUE: before attach succeeds
  ├─ createDialogInjector(dialogRef, data)
  ├─ createComponent(PuiDialogHost, { hostElement: pane })  ← manual, NOT CDK attach
  ├─ overlayRef.attachHost() → adds --open CSS classes
  ├─ attachToHost(hostVcr, portal|component)     ← content in host VCR
  ├─ runChangeDetection + ApplicationRef.tick()
  ├─ focus trap on host element
  └─ overlayRef.afterClosed$ → sync dialogRef.close()
```

### Open flow validation

| Step | Expected | Actual | Issue |
|------|----------|--------|-------|
| 1. Overlay created | CDK overlay in container | ✅ Yes | — |
| 2. Portal attached | Content in overlay pane | ⚠️ Manual VCR, not CDK portal | See #1 |
| 3. Content rendered | Visible UI | ⚠️ Requires detectChanges + imports | See #2, #3 |
| 4. Panel visible | opacity:1 | ✅ `--open` class added sync | — |
| 5. Animation | fade/scale | ✅ CSS transition | Sheet transform specificity risk #12 |

---

## Close Flow Trace

```
User: button.click / Escape / backdrop
  ├─ dialogRef.close(result?)  OR  overlayRef.close() directly
  │    ├─ PuiDialogRef: closed=true, onClose(), overlayRef.close()
  │    └─ PuiOverlayRef: remove --open classes, setTimeout(180ms) → dispose()
  │         ├─ overlayRef.dispose()              ← CDK teardown
  │         ├─ onDispose: unlockBodyScroll, stack.pop
  │         └─ afterClosed$ emits
  ├─ afterClosed$ → dialogRef.close() if not already closed
  └─ focus trap destroyed
```

### Close flow validation

| Step | Expected | Actual | Issue |
|------|----------|--------|-------|
| 1. Button click | Handler runs | ❌ Was broken (CD/injector) | #2, #3 |
| 2. dialogRef.close | Marks closed, emits | ✅ Yes | — |
| 3. overlayRef.close | Animate + dispose | ✅ Yes | — |
| 4. dispose | DOM removed | ⚠️ Partial | #4 hostRef not destroyed |
| 5. cleanup | scroll unlock, stack pop | ✅ Yes | — |

---

## Issues (root cause → files → fix)

### #1 — Dual attachment architecture (CRITICAL)

**Root cause:** `PuiOverlayRef.attach(portal)` wraps CDK attach, but `PuiDialogService` bypasses it entirely. Uses `createComponent({ hostElement: pane })` + `hostVcr.createEmbeddedView/createComponent`. CDK overlay is created empty; CDK `attach()` is never called.

**Affected files:**
- `dialog.service.ts` (attachHost, attachToHost)
- `overlay-ref.ts` (unused attach path for dialogs)

**Proposed fix:** Pick one strategy. Recommended: keep host-wrapper pattern but register explicit `destroy()` for host + content refs in `PuiOverlayRef.dispose()`. Remove or document dead `attach(portal)` path.

---

### #2 — ComponentRef / EmbeddedViewRef not destroyed (CRITICAL)

**Root cause:** `createComponent(PuiDialogHostComponent)` and content refs are never `destroy()`'d on close. Only `overlayRef.dispose()` runs. Orphan listeners and broken re-open behavior.

**Affected files:**
- `dialog.service.ts`
- `overlay-ref.ts`

**Proposed fix:** `registerDetach()` on `PuiOverlayRef`; call `hostRef.destroy()` and `attachResult.destroy()` in `dispose()`.

---

### #3 — Dynamic component tree-shaking (CRITICAL)

**Root cause:** Standalone components opened via `dialog.open(Component)` must be listed in the **consumer's `imports` array** or they are tree-shaken / fail silently at runtime.

**Affected files:**
- `dialog-docs.component.ts`
- Any consumer using component dialogs

**Proposed fix:** Document requirement. Consider runtime dev-mode warning if attach fails. Docs must import `DemoUserDialogComponent`, `PuiDialogConfirmComponent`.

---

### #4 — Template dialog close binding fragility (HIGH)

**Root cause:** Template buttons originally called parent methods (`closeTemplate()`). Portaled templates with custom `EnvironmentInjector` broke parent event bindings. Fixed by passing `dialogRef` in template context — but pattern is mandatory and undocumented.

**Affected files:**
- `dialog.service.ts` (context: `{ dialogRef, $implicit: dialogRef }`)
- All template consumers

**Proposed fix:** Enforce `let-dialogRef="dialogRef"` pattern in docs/tests. Add compile-time example. `ViewContainerRef` param still required but unused for actual attach location (misleading API).

---

### #5 — openRefs pushed before attach completes (HIGH)

**Root cause:** `openRefs.push(dialogRef)` at line 67 occurs before `attachHost` / `attachToHost`. If attach throws, stale ref remains in service stack.

**Affected files:**
- `dialog.service.ts`

**Proposed fix:** Push to `openRefs` only after successful content attach.

---

### #6 — Duplicate ARIA `role="dialog"` (MEDIUM)

**Root cause:** `dialog.service.ts` sets `role="dialog"` + `aria-modal` on `pui-dialog-host`. `PuiDialogComponent` also sets `role="dialog"` + `aria-modal` on inner shell. Nested dialog semantics confuse screen readers and focus trap.

**Affected files:**
- `dialog.service.ts`
- `dialog.component.ts`

**Proposed fix:** ARIA only on `pui-dialog` (content). Host is focus container with `tabindex="-1"` only.

---

### #7 — OnPush + dynamic attach requires explicit CD (HIGH)

**Root cause:** Portaled OnPush components don't render interactive bindings without `detectChanges()`. Service calls it, but only once on attach result — fragile if async updates.

**Affected files:**
- `dialog.service.ts`

**Proposed fix:** Keep `detectChanges` + `ApplicationRef.tick()`. Consider `markForCheck` on host after attach.

---

### #8 — Escape/backdrop only on topmost (OK by design, MEDIUM risk)

**Root cause:** `PuiOverlayStackService.isTopMost()` gates escape and backdrop. Correct for stacking, but if stack desyncs (issue #5), lower dialogs become uncloseable via escape.

**Affected files:**
- `overlay.service.ts`
- `overlay-stack.service.ts`

**Proposed fix:** Ensure stack push/pop always paired with dispose. Add dev assertion on pop.

---

### #9 — RxJS subscriptions never unsubscribed (LOW)

**Root cause:** `backdropClick$`, `keydownEvents$`, `afterClosed$` subscriptions in overlay/dialog services are fire-and-forget. Usually OK if overlay disposed, but leaks if dispose fails.

**Affected files:**
- `overlay.service.ts`
- `dialog.service.ts`

**Proposed fix:** Use `takeUntil(overlayRef.afterClosed$)` or store Subscription and unsubscribe in dispose.

---

### #10 — SSR returns null overlay silently (LOW)

**Root cause:** `PuiOverlayService.create()` returns `null` on server. `PuiDialogService.open()` returns empty `PuiDialogRef`. No error in dev.

**Affected files:**
- `overlay.service.ts`
- `dialog.service.ts`

**Proposed fix:** Acceptable for SSR. Optional dev warning.

---

### #11 — panelClass on pane vs host element (MEDIUM)

**Root cause:** `createComponent({ hostElement: pane })` reuses `.cdk-overlay-pane` as host. CSS classes `pui-overlay-panel` applied by CDK to pane. `--open` toggled via `panelElement` query. Works but fragile if CDK DOM structure changes.

**Affected files:**
- `dialog.service.ts`
- `overlay-ref.ts`
- `overlay.tokens.scss`

**Proposed fix:** Document DOM contract. Query host ref directly instead of `querySelector`.

---

### #12 — Sheet variant CSS transform specificity (LOW)

**Root cause:** `.pui-dialog-panel--sheet.pui-overlay-panel` sets `transform: translateY(100%)`. Open state uses `.pui-overlay-panel--open`. Specificity equal; order matters.

**Affected files:**
- `dialog.tokens.scss`
- `overlay.tokens.scss`

**Proposed fix:** Combine selectors: `.pui-dialog-panel--sheet.pui-overlay-panel--open`.

---

### #13 — Body scroll lock (OK)

**Root cause:** Reference-counted `lockBodyScroll` / `unlockBodyScroll`. Works for stacked dialogs.

**Affected files:**
- `scroll-lock.utils.ts`
- `overlay.service.ts`

**Proposed fix:** None required. Add E2E test.

---

### #14 — Z-index stacking (OK with caveat)

**Root cause:** `BASE_Z_INDEX + depth * 20`. Backdrop at `zIndex-1`, overlay wrapper at `zIndex`. Lower dialog panes covered by upper backdrop — expected.

**Affected files:**
- `overlay-stack.service.ts`
- `overlay.service.ts`

**Proposed fix:** None. E2E test for stacking order.

---

## CSS Audit

| Selector | Risk | Notes |
|----------|------|-------|
| `.pui-overlay-panel` | opacity:0 default | Fixed by `--open` class |
| `.pui-overlay-backdrop` | opacity:0 default | Fixed by `--open` class |
| `pointer-events: auto` on panel | ✅ | Added |
| `display:none` / `visibility:hidden` | ✅ None found | — |
| Docs `overflow:hidden` | Low | On doc examples only, not overlay container |
| z-index conflicts | Low | Sticky TOC uses token, below overlay base 1200 |

---

## Critical Finding — Pane resolution (#13) — **ROOT CAUSE**

**Root cause:** `PuiOverlayRef.panelElement` used `overlayElement.querySelector('.cdk-overlay-pane')`. In Angular CDK 21, `OverlayRef.overlayElement` **is** the pane element. `querySelector` only matches descendants, so `panelElement` was always `undefined`.

**Impact:** `PuiDialogService.attachHost()` threw before content attached → **no dialog ever rendered**. Open animation classes never applied to the real pane. Size styles never applied.

**Affected files:**
- `src/premium-ui/overlay/overlay-ref.ts`
- `src/premium-ui/overlay/overlay.service.ts`

**Fix:** `resolveOverlayPane()` — return `overlayElement` when it has `cdk-overlay-pane`, else query descendants.

---

## Critical Finding — Host attachment (#14)

**Root cause:** `createComponent(PuiDialogHost, { hostElement: pane })` caused dialog content to render as a **sibling** of the pane inside the CDK popover, yielding **0×0 bounding boxes** (invisible to users and Playwright).

**Affected files:** `src/premium-ui/components/dialog/dialog.service.ts`

**Fix:** Create host normally, `pane.appendChild(host)`, `applicationRef.attachView(hostView)`.

---

## Additional Finding — E2E hydration (HIGH)

**Root cause:** Playwright tests used raw `page.goto()` without `waitForHydration()`. Clicks fired before Angular bootstrapped, so `(pressed)` handlers never ran.

**Affected files:** `tests/e2e/docs/dialog-interaction.spec.ts`

**Proposed fix:** Use `navigateToDocsPage()` from `tests/utils/navigation.ts` (same as other docs E2E tests).

---

## Stabilization Result (2026-06-07)

All 9 Playwright dialog E2E tests pass (`tests/e2e/docs/dialog-interaction.spec.ts`).

**Fixes applied:**
1. `#13` — `resolveOverlayPane()` for CDK pane resolution
2. `#14` — Removed broken manual host attachment; dialog now uses `PuiOverlayRef.attach(portal)` (CDK path)
3. Docs — re-added `DemoUserDialogComponent` / `PuiDialogConfirmComponent` to `imports` for dynamic `open()`
4. E2E — `navigateToDocsPage()` hydration + dialog-scoped button selectors

**Deferred (non-blocking):** RxJS subscription cleanup (#9), dev-mode warning for missing dynamic imports (#3 partial).

---

## Test Coverage Gaps (pre-audit)

- No Playwright dialog tests in CI priority routes
- `dialog-interaction.spec.ts` exists but browsers not installed in env
- No unit tests for overlay stack / scroll lock
- No automated escape/backdrop/stacking tests

---

## Stabilization Priority

1. **P0:** Destroy host + content refs on dispose (#2)
2. **P0:** Defer openRefs push until attach succeeds (#5)
3. **P1:** Remove duplicate ARIA on host (#6)
4. **P1:** Playwright regression suite (#11 in user steps)
5. **P2:** Subscription cleanup (#9)
6. **P2:** Sheet CSS specificity (#12)

**Do NOT add:** variants, APIs, or new examples until P0–P1 pass.

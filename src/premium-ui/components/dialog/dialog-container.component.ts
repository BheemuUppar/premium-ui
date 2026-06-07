import {
  ChangeDetectionStrategy,
  Component,
  type ComponentRef,
  type EmbeddedViewRef,
  viewChild,
} from '@angular/core';
import { CdkPortalOutlet } from '@angular/cdk/portal';
import type { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';

/**
 * Overlay shell that hosts dialog content — same role as Angular Material's MatDialogContainer.
 * The service always attaches this first, then projects a component or template inside.
 */
@Component({
  selector: 'pui-dialog-container',
  imports: [CdkPortalOutlet],
  template: '<div class="pui-dialog-container__content"><ng-template cdkPortalOutlet /></div>',
  styleUrl: './dialog-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'pui-dialog-container',
    tabindex: '-1',
  },
})
export class PuiDialogContainerComponent {
  private readonly portalOutlet = viewChild.required(CdkPortalOutlet);

  attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
    return this.portalOutlet().attachComponentPortal(portal);
  }

  attachTemplatePortal(portal: TemplatePortal): EmbeddedViewRef<unknown> {
    return this.portalOutlet().attachTemplatePortal(portal);
  }
}

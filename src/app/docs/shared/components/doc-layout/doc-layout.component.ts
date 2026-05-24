import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'pui-doc-layout',
  template: `
    <article class="pui-doc-layout">
      <ng-content select="pui-doc-header" />
      <ng-content select="pui-doc-tabs-nav" />
      <div class="pui-doc-layout__body">
        <ng-content />
      </div>
    </article>
  `,
  styleUrl: './doc-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PuiDocLayoutComponent {}

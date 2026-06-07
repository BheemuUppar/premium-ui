import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'pui-dialog-header',
  template: '<header class="pui-dialog__header"><ng-content /></header>',
  styleUrl: './dialog-primitives.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'pui-dialog-header' },
})
export class PuiDialogHeaderComponent {}

@Component({
  selector: 'pui-dialog-title',
  template: '<h2 class="pui-dialog__title" [id]="id()"><ng-content /></h2>',
  styleUrl: './dialog-primitives.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'pui-dialog-title' },
})
export class PuiDialogTitleComponent {
  readonly id = input('pui-dialog-title');
}

@Component({
  selector: 'pui-dialog-body',
  template: '<div class="pui-dialog__body"><ng-content /></div>',
  styleUrl: './dialog-primitives.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'pui-dialog-body' },
})
export class PuiDialogBodyComponent {}

@Component({
  selector: 'pui-dialog-footer',
  template: '<footer class="pui-dialog__footer"><ng-content /></footer>',
  styleUrl: './dialog-primitives.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'pui-dialog-footer' },
})
export class PuiDialogFooterComponent {}

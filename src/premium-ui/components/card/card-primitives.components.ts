import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'pui-card-title',
  template: '<h3 class="pui-card__title"><ng-content /></h3>',
  styleUrl: './card-primitives.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'pui-card-title' },
})
export class PuiCardTitleComponent {}

@Component({
  selector: 'pui-card-subtitle',
  template: '<p class="pui-card__subtitle"><ng-content /></p>',
  styleUrl: './card-primitives.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'pui-card-subtitle' },
})
export class PuiCardSubtitleComponent {}

@Component({
  selector: 'pui-card-content',
  template: '<div class="pui-card__content"><ng-content /></div>',
  styleUrl: './card-primitives.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'pui-card-content' },
})
export class PuiCardContentComponent {}

@Component({
  selector: 'pui-card-footer',
  template: '<div class="pui-card__footer"><ng-content /></div>',
  styleUrl: './card-primitives.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'pui-card-footer' },
})
export class PuiCardFooterComponent {}

@Component({
  selector: 'pui-card-actions',
  template: '<div class="pui-card__actions"><ng-content /></div>',
  styleUrl: './card-primitives.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'pui-card-actions' },
})
export class PuiCardActionsComponent {}

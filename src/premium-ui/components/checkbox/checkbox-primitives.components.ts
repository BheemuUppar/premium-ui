import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'pui-checkbox-label',
  template: '<span class="pui-checkbox__label"><ng-content /></span>',
  styleUrl: './checkbox-primitives.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'pui-checkbox-label' },
})
export class PuiCheckboxLabelComponent {}

@Component({
  selector: 'pui-checkbox-description',
  template: '<span class="pui-checkbox__description"><ng-content /></span>',
  styleUrl: './checkbox-primitives.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'pui-checkbox-description' },
})
export class PuiCheckboxDescriptionComponent {}

import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'pui-radio-label',
  template: '<span class="pui-radio__label"><ng-content /></span>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'pui-radio-label' },
})
export class PuiRadioLabelComponent {}

@Component({
  selector: 'pui-radio-description',
  template: '<span class="pui-radio__description"><ng-content /></span>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'pui-radio-description' },
})
export class PuiRadioDescriptionComponent {}

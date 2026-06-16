import { Directive, TemplateRef, inject } from '@angular/core';
import type { PuiCommand } from '../registry/command.types';

/** Projects a custom command item template: `<ng-template puiCommandItem let-command>`. */
@Directive({
  selector: '[puiCommandItem]',
})
export class PuiCommandItemTemplateDirective {
  readonly templateRef = inject<TemplateRef<{ $implicit: PuiCommand }>>(TemplateRef);
}

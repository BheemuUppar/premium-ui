import { Directive, TemplateRef, inject, input } from '@angular/core';
import type { PuiTableCellContext, PuiTableHeaderContext } from '../interfaces';

@Directive({
  selector: '[puiTableCellDef]',
})
export class PuiTableCellDefDirective<T = unknown> {
  readonly puiTableCellDef = input.required<string>({ alias: 'puiTableCellDef' });
  readonly template = inject(TemplateRef<PuiTableCellContext<T>>);
}

@Directive({
  selector: '[puiTableHeaderDef]',
})
export class PuiTableHeaderDefDirective<T = unknown> {
  readonly puiTableHeaderDef = input.required<string>({ alias: 'puiTableHeaderDef' });
  readonly template = inject(TemplateRef<PuiTableHeaderContext<T>>);
}

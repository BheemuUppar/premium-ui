import { Directive, TemplateRef, inject } from '@angular/core';
import type {
  PuiTableEmptyStateTemplateContext,
  PuiTableLoadingTemplateContext,
  PuiTableRowActionsTemplateContext,
  PuiTableToolbarTemplateContext,
} from '../interfaces';

@Directive({
  selector: '[puiTableToolbar]',
})
export class PuiTableToolbarTemplateDirective<T = unknown> {
  readonly template = inject(TemplateRef<PuiTableToolbarTemplateContext<T>>);
}

@Directive({
  selector: '[puiTableToolbarCenter]',
})
export class PuiTableToolbarCenterTemplateDirective {
  readonly template = inject(TemplateRef<unknown>);
}

@Directive({
  selector: '[puiTableEmptyState]',
})
export class PuiTableEmptyStateTemplateDirective {
  readonly template = inject(TemplateRef<PuiTableEmptyStateTemplateContext>);
}

@Directive({
  selector: '[puiTableLoading]',
})
export class PuiTableLoadingTemplateDirective {
  readonly template = inject(TemplateRef<PuiTableLoadingTemplateContext>);
}

@Directive({
  selector: '[puiTableRowActions]',
})
export class PuiTableRowActionsTemplateDirective<T = unknown> {
  readonly template = inject(TemplateRef<PuiTableRowActionsTemplateContext<T>>);
}

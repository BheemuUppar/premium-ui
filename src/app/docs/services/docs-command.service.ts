import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PuiCommandRegistry } from '../../../premium-ui/command';
import { createDocsCommands } from '../commands/docs-commands';

@Injectable()
export class PuiDocsCommandService {
  private readonly registry = inject(PuiCommandRegistry);
  private readonly router = inject(Router);

  register(): void {
    this.registry.clear();
    this.registry.registerMany(createDocsCommands((route) => this.router.navigate(route)));
  }
}

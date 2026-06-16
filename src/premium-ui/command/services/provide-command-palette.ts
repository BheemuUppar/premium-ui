import {
  APP_INITIALIZER,
  EnvironmentProviders,
  makeEnvironmentProviders,
} from '@angular/core';
import type { PuiCommand } from '../registry/command.types';
import { PuiCommandRegistry } from '../registry/command-registry.service';
import { PuiCommandPaletteService } from './command-palette.service';

/** Registers commands during application bootstrap. */
export function providePuiCommands(commands: readonly PuiCommand[]): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: (registry: PuiCommandRegistry) => () => {
        registry.registerMany(commands);
      },
      deps: [PuiCommandRegistry],
    },
  ]);
}

/** Registers default ⌘K / Ctrl+K shortcuts during application bootstrap. */
export function providePuiCommandPalette(
  shortcuts: readonly string[] = ['meta+k', 'ctrl+k']
): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: (palette: PuiCommandPaletteService) => () => {
        palette.registerShortcuts(shortcuts);
      },
      deps: [PuiCommandPaletteService],
    },
  ]);
}

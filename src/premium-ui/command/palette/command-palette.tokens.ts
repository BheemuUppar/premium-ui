import { InjectionToken, TemplateRef } from '@angular/core';
import {
  PUI_COMMAND_DEFAULT_PALETTE_CONFIG,
  type PuiCommand,
  type PuiCommandPaletteConfig,
} from '../registry/command.types';

export const PUI_COMMAND_PALETTE_CONFIG = new InjectionToken<Required<PuiCommandPaletteConfig>>(
  'PUI_COMMAND_PALETTE_CONFIG',
  {
    factory: () => PUI_COMMAND_DEFAULT_PALETTE_CONFIG,
  }
);

export const PUI_COMMAND_PALETTE_ITEM_TEMPLATE = new InjectionToken<
  TemplateRef<{ $implicit: PuiCommand }>
>('PUI_COMMAND_PALETTE_ITEM_TEMPLATE');

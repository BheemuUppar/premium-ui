export const PUI_DEFAULT_ITEM_HEIGHT = 36;
export const PUI_DEFAULT_MAX_PANEL_HEIGHT = 280;

export interface PuiVirtualScrollConfig {
  readonly itemHeight: number;
  readonly maxPanelHeight: number;
}

export const PUI_DEFAULT_VIRTUAL_SCROLL: PuiVirtualScrollConfig = {
  itemHeight: PUI_DEFAULT_ITEM_HEIGHT,
  maxPanelHeight: PUI_DEFAULT_MAX_PANEL_HEIGHT,
};

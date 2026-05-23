/** Shared interaction state flags used across Premium UI components. */
export type PuiInteractionState =
  | 'default'
  | 'hover'
  | 'active'
  | 'focus'
  | 'disabled'
  | 'selected'
  | 'loading';

export interface PuiInteractiveState {
  readonly hoverable: boolean;
  readonly interactive: boolean;
  readonly disabled: boolean;
  readonly loading: boolean;
  readonly selected: boolean;
}

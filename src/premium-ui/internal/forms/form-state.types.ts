/** Shared reactive form interaction state for form controls. */
export interface PuiFormControlState {
  readonly disabled: boolean;
  readonly readOnly: boolean;
  readonly invalid: boolean;
  readonly loading: boolean;
  readonly touched: boolean;
}

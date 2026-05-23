export type PuiSize = 'sm' | 'md' | 'lg';

export type PuiIntent = 'primary' | 'secondary' | 'success' | 'warning' | 'danger';

/** Standard surface variants for form controls and containers. */
export type PuiVariant = 'default' | 'filled' | 'outlined' | 'soft' | 'ghost' | 'minimal';

/** Standard theme context resolved from DOM. */
export type PuiTheme = 'light' | 'dark';

/** Shared selection value primitive. */
export type PuiSelectionValue = string | number;

export type PuiSelectionValues = readonly PuiSelectionValue[];

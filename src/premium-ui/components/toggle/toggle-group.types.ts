import type { PuiSelectionValue } from '../../types/common.types';

export type PuiToggleGroupValue = PuiSelectionValue | null;

export type PuiToggleGroupValues = readonly PuiSelectionValue[];

export type PuiToggleGroupSelection = PuiToggleGroupValue | PuiToggleGroupValues;

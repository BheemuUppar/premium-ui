import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PuiButtonComponent } from '../../button';
import { injectPuiDialogData, injectPuiDialogRef } from '../dialog.tokens';
import type { PuiDialogConfirmConfig } from '../dialog.types';
import { PuiDialogComponent } from '../dialog.component';
import {
  PuiDialogBodyComponent,
  PuiDialogFooterComponent,
  PuiDialogHeaderComponent,
  PuiDialogTitleComponent,
} from '../dialog-primitives.components';

@Component({
  selector: 'pui-confirm-dialog',
  imports: [
    PuiDialogComponent,
    PuiDialogHeaderComponent,
    PuiDialogTitleComponent,
    PuiDialogBodyComponent,
    PuiDialogFooterComponent,
    PuiButtonComponent,
  ],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PuiDialogConfirmComponent {
  protected readonly data = injectPuiDialogData<PuiDialogConfirmConfig>();
  private readonly dialogRef = injectPuiDialogRef<PuiDialogConfirmComponent, boolean>();

  protected confirm(): void {
    this.dialogRef.close(true);
  }

  protected cancel(): void {
    this.dialogRef.close(false);
  }
}

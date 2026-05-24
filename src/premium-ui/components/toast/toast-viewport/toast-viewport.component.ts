import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PUI_TOAST_POSITIONS } from '../toast.utils';
import { PuiToastService } from '../toast.service';
import { PuiToastComponent } from '../toast-item/toast.component';

@Component({
  selector: 'pui-toast-viewport',
  imports: [PuiToastComponent],
  templateUrl: './toast-viewport.component.html',
  styleUrl: './toast-viewport.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PuiToastViewportComponent {
  protected readonly toastService = inject(PuiToastService);
  protected readonly positions = PUI_TOAST_POSITIONS;
  protected readonly grouped = this.toastService.grouped;
}

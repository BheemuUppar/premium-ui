import { ChangeDetectionStrategy, Component, booleanAttribute, input } from '@angular/core';
import type { PuiCardImageAspect, PuiCardImagePosition } from './card.types';

@Component({
  selector: 'pui-card-image',
  templateUrl: './card-image.component.html',
  styleUrl: './card-image.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'pui-card-image',
    '[class.pui-card-image--top]': "position() === 'top'",
    '[class.pui-card-image--left]': "position() === 'left'",
    '[class.pui-card-image--right]': "position() === 'right'",
    '[class.pui-card-image--square]': "aspect() === 'square'",
    '[class.pui-card-image--video]': "aspect() === 'video'",
    '[class.pui-card-image--wide]': "aspect() === 'wide'",
    '[class.pui-card-image--portrait]': "aspect() === 'portrait'",
    '[class.pui-card-image--zoom]': 'zoomOnHover()',
    '[class.pui-card-image--overlay]': 'overlay()',
    '[class.pui-card-image--gradient]': 'gradientOverlay()',
    '[class.pui-card-image--cinema]': 'cinema()',
    '[class.pui-card-image--flush]': 'flush()',
  },
})
export class PuiCardImageComponent {
  readonly src = input.required<string>();
  readonly alt = input.required<string>();
  readonly aspect = input<PuiCardImageAspect>('video');
  readonly position = input<PuiCardImagePosition>('top');
  readonly zoomOnHover = input(false, { transform: booleanAttribute });
  readonly overlay = input(false, { transform: booleanAttribute });
  readonly gradientOverlay = input(false, { transform: booleanAttribute });
  readonly flush = input(true, { transform: booleanAttribute });
  readonly cinema = input(false, { transform: booleanAttribute });
}

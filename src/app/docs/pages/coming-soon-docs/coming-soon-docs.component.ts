import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { PuiButtonComponent } from '../../../../premium-ui/components/button';

@Component({
  selector: 'app-coming-soon-docs',
  imports: [PuiButtonComponent, RouterLink],
  templateUrl: './coming-soon-docs.component.html',
  styleUrl: './coming-soon-docs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComingSoonDocsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly componentParam = toSignal(this.route.paramMap.pipe(map((params) => params.get('component') ?? 'component')), {
    initialValue: 'component'
  });

  protected readonly componentName = computed(() =>
    this.componentParam()
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ')
  );
}

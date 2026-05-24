import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { useFoundationPageSeo } from '../../seo/use-docs-page-seo';

@Component({
  selector: 'app-foundation-docs',
  templateUrl: './foundation-docs.component.html',
  styleUrl: './foundation-docs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FoundationDocsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly sectionParam = toSignal(this.route.paramMap.pipe(map((params) => params.get('section') ?? 'colors')), {
    initialValue: 'colors'
  });

  protected readonly sectionTitle = computed(() => {
    const section = this.sectionParam();
    return section.charAt(0).toUpperCase() + section.slice(1);
  });

  constructor() {
    useFoundationPageSeo(this.sectionParam);
  }

  protected readonly tokenRows = [
    '--pui-background',
    '--pui-surface',
    '--pui-text',
    '--pui-muted',
    '--pui-border',
    '--pui-ring',
    '--pui-space-md',
    '--pui-radius-md',
    '--pui-shadow-sm'
  ] as const;
}

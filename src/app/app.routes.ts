import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'docs/components/button/overview',
    pathMatch: 'full'
  },
  {
    path: 'docs',
    loadComponent: () => import('./docs/layout/docs-layout.component').then((component) => component.DocsLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'components/button/overview',
        pathMatch: 'full'
      },
      {
        path: 'components/button',
        redirectTo: 'components/button/overview',
        pathMatch: 'full'
      },
      {
        path: 'components/button/:tab',
        loadComponent: () => import('./docs/pages/button-docs/button-docs.component').then((component) => component.ButtonDocsComponent)
      },
      {
        path: 'components/input',
        redirectTo: 'components/input/overview',
        pathMatch: 'full'
      },
      {
        path: 'components/input/:tab',
        loadComponent: () => import('./docs/pages/input-docs/input-docs.component').then((component) => component.InputDocsComponent)
      },
      {
        path: 'components/card',
        redirectTo: 'components/card/overview',
        pathMatch: 'full'
      },
      {
        path: 'components/card/:tab',
        loadComponent: () => import('./docs/pages/card-docs/card-docs.component').then((component) => component.CardDocsComponent)
      },
      {
        path: 'foundations/:section',
        loadComponent: () => import('./docs/pages/foundation-docs/foundation-docs.component').then((component) => component.FoundationDocsComponent)
      },
      {
        path: 'components/:component',
        loadComponent: () => import('./docs/pages/coming-soon-docs/coming-soon-docs.component').then((component) => component.ComingSoonDocsComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'docs/components/button/overview'
  }
];

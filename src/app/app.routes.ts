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

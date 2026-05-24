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
        path: 'components/select',
        redirectTo: 'components/select/overview',
        pathMatch: 'full'
      },
      {
        path: 'components/select/:tab',
        loadComponent: () => import('./docs/pages/select-docs/select-docs.component').then((component) => component.SelectDocsComponent)
      },
      {
        path: 'components/checkbox',
        redirectTo: 'components/checkbox/overview',
        pathMatch: 'full'
      },
      {
        path: 'components/checkbox/:tab',
        loadComponent: () => import('./docs/pages/checkbox-docs/checkbox-docs.component').then((component) => component.CheckboxDocsComponent)
      },
      {
        path: 'components/radio',
        redirectTo: 'components/radio/overview',
        pathMatch: 'full'
      },
      {
        path: 'components/radio/:tab',
        loadComponent: () => import('./docs/pages/radio-docs/radio-docs.component').then((component) => component.RadioDocsComponent)
      },
      {
        path: 'components/switch',
        redirectTo: 'components/switch/overview',
        pathMatch: 'full'
      },
      {
        path: 'components/switch/:tab',
        loadComponent: () => import('./docs/pages/switch-docs/switch-docs.component').then((component) => component.SwitchDocsComponent)
      },
      {
        path: 'components/toggle',
        redirectTo: 'components/toggle/overview',
        pathMatch: 'full'
      },
      {
        path: 'components/toggle/:tab',
        loadComponent: () => import('./docs/pages/toggle-docs/toggle-docs.component').then((component) => component.ToggleDocsComponent)
      },
      {
        path: 'components/tabs',
        redirectTo: 'components/tabs/overview',
        pathMatch: 'full'
      },
      {
        path: 'components/tabs/:tab',
        loadComponent: () => import('./docs/pages/tabs-docs/tabs-docs.component').then((component) => component.TabsDocsComponent)
      },
      {
        path: 'components/toast',
        redirectTo: 'components/toast/overview',
        pathMatch: 'full'
      },
      {
        path: 'components/toast/:tab',
        loadComponent: () => import('./docs/pages/toast-docs/toast-docs.component').then((component) => component.ToastDocsComponent)
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

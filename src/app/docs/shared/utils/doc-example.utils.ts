import type { PuiDocCodeTab } from '../../docs.types';
import type { PuiSelectOption } from '../../../../premium-ui/components/select';

export interface PuiDocImportSpec {
  readonly name: string;
  readonly path: string;
}

export interface PuiDocStandaloneExampleConfig {
  readonly selector: string;
  readonly componentClass: string;
  readonly imports: readonly PuiDocImportSpec[];
  readonly template: string;
  readonly templateUrl?: string;
  readonly styleUrl?: string;
  readonly members?: readonly string[];
  readonly usesSignal?: boolean;
  readonly injects?: readonly PuiDocImportSpec[];
}

export function toSelectOptions<T extends string>(
  values: readonly T[]
): readonly PuiSelectOption[] {
  return values.map((value) => ({ label: value, value }));
}

export function buildStandaloneTsExample(config: PuiDocStandaloneExampleConfig): string {
  const needsInject = (config.injects?.length ?? 0) > 0;
  const signalImport = config.usesSignal ? ', signal' : '';
  const injectImport = needsInject ? ', inject' : '';
  const angularImport = `import { Component${signalImport}${injectImport} } from '@angular/core';`;

  const componentImports = config.imports
    .map((spec) => `import { ${spec.name} } from '${spec.path}';`)
    .join('\n');

  const serviceImports = config.injects
    ?.map((spec) => `import { ${spec.name} } from '${spec.path}';`)
    .join('\n');

  const standaloneImports = config.imports.map((spec) => spec.name).join(', ');
  const templateField = config.templateUrl
    ? `  templateUrl: '${config.templateUrl}',`
    : `  template: \`${config.template}\`,`;
  const styleField = config.styleUrl ? `\n  styleUrl: '${config.styleUrl}',` : '';

  const injectMembers =
    config.injects?.map((spec) => `  private readonly ${toFieldName(spec.name)} = inject(${spec.name});`) ??
    [];

  const members = [...injectMembers, ...(config.members ?? [])];
  const memberBlock = members.length
    ? `\n${members.map((member) => (member ? `  ${member}` : '')).join('\n')}\n`
    : '\n';

  return [angularImport, componentImports, serviceImports].filter(Boolean).join('\n') + `

@Component({
  selector: '${config.selector}',
  imports: [${standaloneImports}],
${templateField}${styleField}
})
export class ${config.componentClass} {${memberBlock}}`;
}

function toFieldName(typeName: string): string {
  return typeName.replace(/^Pui/, '').replace(/Component$|Service$/, '').toLowerCase() || 'service';
}

/** HTML + TypeScript tabs with strict separation — HTML is template markup only. */
export function buildHtmlTsTabs(
  html: string,
  config: Omit<PuiDocStandaloneExampleConfig, 'template'> & {
    readonly htmlFilename?: string;
    readonly tsFilename?: string;
  }
): readonly PuiDocCodeTab[] {
  const tsCode = buildStandaloneTsExample({ ...config, template: html });

  return [
    {
      id: 'html',
      label: 'HTML',
      code: html.trim(),
      language: 'html',
      filename: config.htmlFilename ?? 'example.component.html',
    },
    {
      id: 'ts',
      label: 'TypeScript',
      code: tsCode.trim(),
      language: 'typescript',
      filename: config.tsFilename ?? 'example.component.ts',
    },
  ];
}

/** Service-driven example — injects services outside @Component imports. */
export function buildServiceExampleTabs(config: {
  readonly html: string;
  readonly selector: string;
  readonly componentClass: string;
  readonly componentImports: readonly PuiDocImportSpec[];
  readonly services: readonly PuiDocImportSpec[];
  readonly methods: readonly string[];
  readonly templateUrl?: string;
  readonly htmlFilename?: string;
  readonly tsFilename?: string;
}): readonly PuiDocCodeTab[] {
  return buildHtmlTsTabs(config.html, {
    selector: config.selector,
    componentClass: config.componentClass,
    imports: config.componentImports,
    injects: config.services,
    members: config.methods,
    templateUrl: config.templateUrl ?? './example.component.html',
    htmlFilename: config.htmlFilename,
    tsFilename: config.tsFilename,
  });
}

/** App shell snippet — router + global providers like toast viewport. */
export function buildAppShellTabs(config: {
  readonly html: string;
  readonly componentClass?: string;
  readonly imports: readonly PuiDocImportSpec[];
}): readonly PuiDocCodeTab[] {
  const componentImports = config.imports
    .map((spec) => `import { ${spec.name} } from '${spec.path}';`)
    .join('\n');

  const standaloneImports = config.imports.map((spec) => spec.name).join(', ');
  const ts = `import { Component } from '@angular/core';
${componentImports}

@Component({
  selector: 'app-root',
  imports: [${standaloneImports}],
  template: \`${config.html.trim()}\`,
})
export class ${config.componentClass ?? 'App'} {}`;

  return [
    { id: 'html', label: 'HTML', code: config.html.trim(), language: 'html', filename: 'app.component.html' },
    { id: 'ts', label: 'TypeScript', code: ts.trim(), language: 'typescript', filename: 'app.component.ts' },
  ];
}

/** Logic-only snippet (no template) for service calls and async flows. */
export function buildLogicTabs(config: {
  readonly code: string;
  readonly services?: readonly PuiDocImportSpec[];
  readonly filename?: string;
}): readonly PuiDocCodeTab[] {
  const imports = config.services?.map((s) => `import { ${s.name} } from '${s.path}';`).join('\n') ?? '';
  const ts = [imports, config.code.trim()].filter(Boolean).join('\n\n');

  return [{ id: 'ts', label: 'TypeScript', code: ts, language: 'typescript', filename: config.filename ?? 'example.ts' }];
}

export function buildPlaygroundTsExample(config: {
  readonly componentClass: string;
  readonly imports: readonly PuiDocImportSpec[];
  readonly services?: readonly PuiDocImportSpec[];
  readonly members: readonly string[];
}): string {
  const componentImports = config.imports
    .map((spec) => `import { ${spec.name} } from '${spec.path}';`)
    .join('\n');

  const serviceImports =
    config.services?.map((spec) => `import { ${spec.name} } from '${spec.path}';`).join('\n') ?? '';

  const standaloneImports = config.imports.map((spec) => spec.name).join(', ');
  const injectMembers =
    config.services?.map((spec) => `  private readonly ${toFieldName(spec.name)} = inject(${spec.name});`) ?? [];
  const members = [...injectMembers, ...config.members.map((member) => `  ${member}`)].join('\n');

  return `import { Component, inject${config.members.some((m) => m.includes('signal')) ? ', signal' : ''} } from '@angular/core';
${componentImports}
${serviceImports}

@Component({
  selector: 'app-playground',
  imports: [${standaloneImports}],
  templateUrl: './playground.component.html',
})
export class ${config.componentClass} {
${members}
}`;
}

/** SCSS-only token overrides for theming sections. */
export function buildThemeTabs(
  scss: string,
  filename = 'styles.scss'
): readonly PuiDocCodeTab[] {
  return [{ id: 'scss', label: 'SCSS', code: scss.trim(), language: 'scss', filename }];
}

export function buildPlaygroundExampleTabs(config: {
  readonly html: string;
  readonly componentClass: string;
  readonly componentImports: readonly PuiDocImportSpec[];
  readonly services?: readonly PuiDocImportSpec[];
  readonly members: readonly string[];
}): readonly PuiDocCodeTab[] {
  return [
    {
      id: 'html',
      label: 'HTML',
      code: config.html.trim(),
      language: 'html',
      filename: 'playground.component.html',
    },
    {
      id: 'ts',
      label: 'TypeScript',
      code: buildPlaygroundTsExample({
        componentClass: config.componentClass,
        imports: config.componentImports,
        services: config.services,
        members: config.members,
      }).trim(),
      language: 'typescript',
      filename: 'playground.component.ts',
    },
  ];
}

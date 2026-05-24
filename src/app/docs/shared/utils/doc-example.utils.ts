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
}

export function toSelectOptions<T extends string>(
  values: readonly T[]
): readonly PuiSelectOption[] {
  return values.map((value) => ({ label: value, value }));
}

export function buildStandaloneTsExample(config: PuiDocStandaloneExampleConfig): string {
  const signalImport = config.usesSignal ? ', signal' : '';
  const angularImport = config.usesSignal
    ? `import { Component${signalImport} } from '@angular/core';`
    : `import { Component } from '@angular/core';`;

  const componentImports = config.imports
    .map((spec) => `import { ${spec.name} } from '${spec.path}';`)
    .join('\n');

  const standaloneImports = config.imports.map((spec) => spec.name).join(', ');
  const templateField = config.templateUrl
    ? `  templateUrl: '${config.templateUrl}',`
    : `  template: \`${config.template}\`,`;
  const styleField = config.styleUrl ? `\n  styleUrl: '${config.styleUrl}',` : '';

  const members = config.members?.length
    ? `\n${config.members.map((member) => `  ${member}`).join('\n')}\n`
    : '\n';

  return `${angularImport}
${componentImports}

@Component({
  selector: '${config.selector}',
  imports: [${standaloneImports}],
${templateField}${styleField}
})
export class ${config.componentClass} {${members}}`;
}

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
      code: html,
      language: 'html',
    },
    {
      id: 'ts',
      label: 'TypeScript',
      code: tsCode,
      language: 'typescript',
    },
  ];
}

export function buildPlaygroundTsExample(config: {
  readonly componentClass: string;
  readonly imports: readonly PuiDocImportSpec[];
  readonly members: readonly string[];
}): string {
  const componentImports = config.imports
    .map((spec) => `import { ${spec.name} } from '${spec.path}';`)
    .join('\n');

  const standaloneImports = config.imports.map((spec) => spec.name).join(', ');
  const members = config.members.map((member) => `  ${member}`).join('\n');

  return `import { Component, signal } from '@angular/core';
${componentImports}

@Component({
  selector: 'app-playground',
  imports: [${standaloneImports}],
  templateUrl: './playground.component.html',
})
export class ${config.componentClass} {
${members}
}`;
}

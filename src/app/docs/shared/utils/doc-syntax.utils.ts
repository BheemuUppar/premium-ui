export type DocSyntaxLanguage = 'html' | 'typescript' | 'ts' | 'scss' | 'css' | string;

const PLACEHOLDER_PATTERN = /\uE000(\d+)\uE001/g;

const TS_KEYWORDS = new Set([
  'import',
  'export',
  'from',
  'as',
  'class',
  'extends',
  'implements',
  'interface',
  'type',
  'enum',
  'readonly',
  'const',
  'let',
  'var',
  'return',
  'if',
  'else',
  'switch',
  'case',
  'break',
  'default',
  'for',
  'while',
  'do',
  'new',
  'this',
  'super',
  'true',
  'false',
  'null',
  'undefined',
  'void',
  'async',
  'await',
  'protected',
  'private',
  'public',
  'static',
  'get',
  'set',
  'of',
  'in',
  'instanceof',
  'typeof',
  'signal',
  'computed',
  'effect',
  'inject',
  'model',
  'input',
  'output',
]);

const highlightCache = new Map<string, string>();

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function wrap(className: string, value: string): string {
  return `<span class="${className}">${value}</span>`;
}

function makePlaceholder(index: number): string {
  return `\uE000${index}\uE001`;
}

function protect(
  source: string,
  store: string[],
  pattern: RegExp,
  replacer: (match: string, ...groups: string[]) => string
): string {
  return source.replace(pattern, (...args) => {
    const match = args[0] as string;
    const wrapped = replacer(match, ...(args.slice(1) as string[]));
    const index = store.length;
    store.push(wrapped);
    return makePlaceholder(index);
  });
}

function restore(source: string, store: string[]): string {
  return source.replace(PLACEHOLDER_PATTERN, (_, index: string) => store[Number(index)] ?? '');
}

function containsPlaceholder(value: string): boolean {
  return value.includes('\uE000');
}

function highlightTypeScript(source: string): string {
  const store: string[] = [];
  let code = source;

  code = protect(code, store, /(\/\/[^\n]*)/g, (match) => wrap('tok-comment', match));
  code = protect(code, store, /(\/\*[\s\S]*?\*\/)/g, (match) => wrap('tok-comment', match));
  code = protect(
    code,
    store,
    /('(?:\\'|[^'])*'|"(?:\\"|[^"])*"|`(?:\\`|[^`])*`)/g,
    (match) => wrap('tok-string', match)
  );
  code = protect(code, store, /(@(?:Component|Injectable|Directive|Pipe|NgModule|Input|Output|HostBinding|HostListener)\b)/g, (match) =>
    wrap('tok-decorator', match)
  );
  code = protect(
    code,
    store,
    /\b(import|export)\s+(?:type\s+)?(\{[^}]+\}|\*\s+as\s+\w+|\w+)/g,
    (_match, keyword, clause) => `${wrap('tok-keyword', keyword)} ${wrap('tok-import', clause)}`
  );
  code = protect(code, store, /\bfrom\s+('[^']+'|"[^"]+")/g, (_match, path) =>
    `${wrap('tok-keyword', 'from')} ${wrap('tok-string', path)}`
  );
  code = protect(code, store, /\b([A-Z][\w]*)\b/g, (match) =>
    containsPlaceholder(match) ? match : wrap('tok-type', match)
  );
  code = protect(code, store, /\b([a-z_$][\w$]*)\s*(?=\()/g, (_match, name) =>
    containsPlaceholder(name) ? _match : wrap('tok-function', name)
  );
  code = protect(code, store, /\b([a-z_$][\w$]*)\b/g, (match, word) => {
    if (containsPlaceholder(match)) {
      return match;
    }
    return TS_KEYWORDS.has(word) ? wrap('tok-keyword', word) : match;
  });

  return restore(code, store);
}

function highlightHtml(source: string): string {
  const store: string[] = [];
  let code = source;

  code = protect(code, store, /&lt;!--[\s\S]*?--&gt;/g, (match) => wrap('tok-comment', match));
  code = protect(
    code,
    store,
    /(['"])(?:\\.|(?!\1)[^\\])*\1/g,
    (match) => wrap('tok-string', match)
  );
  code = protect(code, store, /\[\([^)]+\)\]/g, (match) => wrap('tok-binding tok-binding--twoway', match));
  code = protect(code, store, /\([^)]+\)/g, (match) => wrap('tok-binding tok-binding--event', match));
  code = protect(code, store, /\[[^\]]+\]/g, (match) => wrap('tok-binding tok-binding--property', match));
  code = protect(code, store, /(@(?:if|for|switch|defer|else|let|empty|placeholder|loading|error|host)\b)/g, (match) =>
    wrap('tok-directive', match)
  );
  code = protect(
    code,
    store,
    /(\*ng[A-Za-z]+|#\w+)/g,
    (match) => wrap('tok-directive', match)
  );
  code = protect(code, store, /&lt;\/?[\w-]+/g, (match) => wrap('tok-tag', match));
  code = protect(code, store, /(?<![\w-])([\w-]+)(?==)/g, (_match, name) =>
    containsPlaceholder(name) ? _match : wrap('tok-attr', name)
  );
  code = protect(code, store, /(&gt;)/g, (match) => wrap('tok-tag', match));

  return restore(code, store);
}

function highlightScss(source: string): string {
  const store: string[] = [];
  let code = source;

  code = protect(code, store, /(\/\/[^\n]*)/g, (match) => wrap('tok-comment', match));
  code = protect(code, store, /(\/\*[\s\S]*?\*\/)/g, (match) => wrap('tok-comment', match));
  code = protect(
    code,
    store,
    /('(?:\\'|[^'])*'|"(?:\\"|[^"])*")/g,
    (match) => wrap('tok-string', match)
  );
  code = protect(code, store, /(--[\w-]+)/g, (match) => wrap('tok-variable', match));
  code = protect(code, store, /(@[\w-]+)/g, (match) => wrap('tok-directive', match));
  code = protect(code, store, /([\w-]+)(?=\s*:)/g, (_match, prop) =>
    containsPlaceholder(prop) ? _match : wrap('tok-attr', prop)
  );
  code = protect(code, store, /(#[\da-fA-F]{3,8})/g, (match) => wrap('tok-string', match));

  return restore(code, store);
}

function highlightBash(source: string): string {
  const store: string[] = [];
  let code = source;

  code = protect(code, store, /(#.*)$/gm, (match) => wrap('tok-comment', match));
  code = protect(code, store, /\b(npm|yarn|pnpm|npx|install|run)\b/g, (match) => wrap('tok-keyword', match));
  code = protect(
    code,
    store,
    /(@[\w-/]+)/g,
    (match) => wrap('tok-string', match)
  );

  return restore(code, store);
}

function highlightByLanguage(escaped: string, language: DocSyntaxLanguage): string {
  const lang = language.toLowerCase();

  switch (lang) {
    case 'html':
    case 'xml':
      return highlightHtml(escaped);
    case 'typescript':
    case 'ts':
      return highlightTypeScript(escaped);
    case 'scss':
    case 'css':
      return highlightScss(escaped);
    case 'bash':
    case 'shell':
    case 'sh':
      return highlightBash(escaped);
    default:
      return escaped;
  }
}

export function highlightDocCode(code: string, language: DocSyntaxLanguage): string {
  const cacheKey = `${language}\u0000${code}`;
  const cached = highlightCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const result = highlightByLanguage(escapeHtml(code), language);

  if (highlightCache.size > 256) {
    highlightCache.clear();
  }

  highlightCache.set(cacheKey, result);
  return result;
}

export function countDocCodeLines(code: string): number {
  if (!code) {
    return 1;
  }

  return code.split('\n').length;
}

/**
 * Lecture des jetons de src/styles/theme.css au moment du build.
 * Sert à Base.astro pour la couleur `theme-color` du navigateur et les
 * couleurs du favicon — ainsi, changer de thème ne demande de modifier QUE
 * theme.css (les polices y sont importées en tête, auto-hébergées).
 */
import themeCss from '../styles/theme.css?raw';

function parseTokens(css: string): Record<string, string> {
  const tokens: Record<string, string> = {};
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const re = /(--[\w-]+)\s*:\s*((?:'[^']*'|"[^"]*"|[^;{}])+);/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(clean))) tokens[match[1]] = match[2].trim();
  return tokens;
}

const tokens = parseTokens(themeCss);

/** Valeur d'un jeton, var() résolus (profondeur limitée). */
export function token(name: string): string {
  let value = tokens[name] ?? '';
  for (let i = 0; i < 10 && /var\(/.test(value); i += 1) {
    value = value.replace(/var\((--[\w-]+)(?:\s*,\s*([^)]+))?\)/g, (_, n: string, fb?: string) => tokens[n] ?? fb ?? '');
  }
  return value.trim();
}

export const themeColor = token('--c-bg');
export const accentColor = token('--c-accent');

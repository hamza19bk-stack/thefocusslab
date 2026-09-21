#!/usr/bin/env node
/**
 * scripts/check.mjs — assurance qualité déterministe du template (npm run check)
 * ===========================================================================
 *
 *  1. `astro build` (sauf option --no-build) ;
 *  2. vérifications sur les SOURCES, le THÈME et le site généré (dist/) ;
 *  3. sortie : code 1 s'il y a au moins une ERREUR ; les AVERTISSEMENTS
 *     (champs à renseigner avant la mise en production) sont listés sans échouer.
 *
 *  ERREURS
 *  -------
 *  Thème (src/styles/theme.css ET chaque src/styles/themes/*.example.css) :
 *   - chaque jeton de REQUIRED_TOKENS est défini ;
 *   - --c-bg, --c-bg-deep, --c-surface, --c-surface-2 sont des couleurs opaques ;
 *   - contrastes WCAG 2.x (var() résolus ; hex, rgb/rgba, hsl/hsla ; une couleur
 *     semi-transparente est composée sur le fond testé) :
 *       · --c-text, --c-text-soft, --c-text-muted sur les 4 fonds ........ >= 4.5:1
 *       · --c-text-on-accent sur --c-accent et --c-accent-bright ......... >= 4.5:1
 *       · --c-accent sur --c-bg (élément d'interface) ....................  >= 3:1
 *       · TOUT jeton utilisé dans une déclaration `color:` de global.css ou
 *         d'un <style> de composant (alias locaux type --btn-color suivis)
 *         sur les 4 fonds .................................................. >= 4.5:1
 *         (exceptions documentées dans ON_BACKGROUND : texte posé sur un fond précis) ;
 *   - RÈGLE color-mix : color-mix() est interdit dans une déclaration `color:`
 *     (le contraste d'un texte doit être calculable à partir des jetons) ;
 *   - aucune couleur en dur (hex, rgb/hsl, noms) dans global.css, dans les <style>
 *     des .astro, ni dans les attributs SVG fill/stroke (ni var() dans ces attributs) ;
 *   - POLICES AUTO-HÉBERGÉES : aucune URL fonts.googleapis.com / fonts.gstatic.com ;
 *     chaque @import du thème existe dans node_modules et la première famille de
 *     --font-display / --font-body / --font-label est fournie par un @import
 *     (ou est une police système).
 *  Sources :
 *   - aucun texte en dur dans les .astro (tout texte vient de src/data/content.ts) ;
 *   - un seul helper « placeholder » : isSet (src/lib/utils.ts) ;
 *   - icônes citées dans content.ts présentes dans Icon.astro ;
 *   - content.ts : aucune promesse commerciale (offert, gratuit, garanti, sans
 *     engagement…) ni vocabulaire médical interdit ;
 *   - PÉRIMÈTRE (identique au site d'origine) : site.nav = les 5 pages (Accueil,
 *     À propos, Services, Réservation, Contact) ; aucune mention de CGV, paiement
 *     en ligne, prix, tarifs ou forfaits (content.ts et dist/) ;
 *   - cohérence site.ts : URL https sans barre finale, e-mail, SIRET, CNAME = domaine,
 *     og:image présente dans public/.
 *  dist/ :
 *   - aucune URL fonts.googleapis.com / fonts.gstatic.com (HTML, CSS, JS) ;
 *   - aucun <script src> ni <link href> Calendly dans le HTML (widget chargé après clic) ;
 *     si calendlyUrl est renseigné, le bouton « Afficher le calendrier » est présent ;
 *   - les 7 pages existent, chacune lie /mentions-legales et /confidentialite ; pas de page CGV ;
 *   - aucune occurrence visible de TODO, undefined, null, NaN, [object Object], lorem ;
 *   - aucun commentaire HTML <!-- ;
 *   - exactement un <h1> par page ; aucun titre, paragraphe, élément ou liste vide ;
 *   - ids uniques ; chaque lien interne href="/…" ou "#…" (et chaque référence
 *     aria-labelledby / aria-controls) résout vers une page ou un id existant ;
 *   - typographie française : pas d'espace ordinaire (ni d'absence d'espace) avant
 *     : ; ! ? ; guillemets « » avec insécables ; pas d'apostrophe droite ;
 *   - vocabulaire médical interdit absent ;
 *   - sections optionnelles (data-optional) : présentes SI ET SEULEMENT SI leurs
 *     données sont renseignées (témoignages, formations, chiffres, note CTA,
 *     réseaux, WhatsApp, coach, infos pratiques).
 *
 *  AVERTISSEMENTS : champs de site.ts non renseignés, mentions légales
 *  « (à compléter) », données facultatives vides — sous forme de checklist.
 */

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const SRC = path.join(ROOT, 'src');
const args = new Set(process.argv.slice(2));

const errors = [];
const warnings = [];
const optionalInfo = [];
const err = (scope, msg) => errors.push(`[${scope}] ${msg}`);
const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');

/* ------------------------------------------------------------------ OUTILS */

function walk(dir, filter = () => true) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p, filter) : filter(p) ? [p] : [];
  });
}
const read = (p) => fs.readFileSync(p, 'utf8');
const stripCssComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '');

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', '#39': "'" };
function decode(s) {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (all, n) => ENTITIES[n.toLowerCase()] ?? all);
}

/* ================================================================== 1. BUILD */

if (!args.has('--no-build')) {
  console.log('> astro build');
  const r = spawnSync(process.execPath, [path.join(ROOT, 'node_modules', 'astro', 'astro.js'), 'build'], {
    cwd: ROOT,
    stdio: 'inherit',
  });
  if (r.status !== 0) {
    console.error('\nÉCHEC : astro build a échoué.');
    process.exit(1);
  }
}

/* ============================================================ 2. DONNÉES (TS) */

const esbuild = await import('esbuild');
const bundle = await esbuild.build({
  stdin: {
    contents: [
      "export { site } from './src/data/site.ts';",
      "export * as content from './src/data/content.ts';",
      "export { isSet } from './src/lib/utils.ts';",
    ].join('\n'),
    resolveDir: ROOT,
    loader: 'ts',
  },
  bundle: true,
  format: 'esm',
  platform: 'node',
  write: false,
  logLevel: 'silent',
});
const { site, content, isSet } = await import(
  `data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`
);

/* ================================================================= 3. THÈME */

/** Jetons obligatoires de theme.css (documentés en tête de theme.css). */
const REQUIRED_TOKENS = [
  '--color-scheme',
  // fonds et surfaces
  '--c-bg', '--c-bg-deep', '--c-surface', '--c-surface-2', '--c-surface-3',
  // bordures et voiles
  '--c-border', '--c-border-strong', '--c-overlay', '--c-overlay-alt', '--c-grid-line', '--c-shadow',
  // textes
  '--c-text', '--c-text-soft', '--c-text-muted', '--c-text-faint', '--c-text-on-accent',
  // accents
  '--c-accent', '--c-accent-bright', '--c-accent-dim', '--c-accent-soft', '--c-accent-2', '--c-accent-2-soft',
  // halos et dégradés
  '--halo-1', '--halo-2', '--halo-strength', '--grad-accent', '--grad-surface', '--grad-line', '--grad-visual',
  // ombres
  '--shadow-xs', '--shadow-s', '--shadow-m', '--shadow-l', '--shadow-accent', '--ring',
  // impression
  '--c-print-bg', '--c-print-text',
  // polices (fichiers importés par @import en tête du thème)
  '--font-display', '--font-label', '--font-body', '--font-mono',
  // rayons
  '--radius-xs', '--radius-s', '--radius-m', '--radius-l', '--radius-xl', '--radius-pill', '--radius-btn',
  // variables de style
  '--heading-transform', '--heading-weight', '--heading-tracking', '--display-leading', '--label-transform',
];
const OPAQUE_BGS = ['--c-bg', '--c-bg-deep', '--c-surface', '--c-surface-2'];
const TEXT_TOKENS = ['--c-text', '--c-text-soft', '--c-text-muted'];
/** Jetons de texte posés sur un fond précis (au lieu des 4 fonds). */
const ON_BACKGROUND = {
  '--c-text-on-accent': ['--c-accent', '--c-accent-bright'],
  '--c-print-text': ['--c-print-bg'],
};

function parseTokens(css) {
  const tokens = {};
  const re = /(--[\w-]+)\s*:\s*((?:'[^']*'|"[^"]*"|[^;{}])+);/g;
  for (const m of stripCssComments(css).matchAll(re)) tokens[m[1]] = m[2].trim();
  return tokens;
}

function resolveVars(value, tokens, depth = 0) {
  if (depth > 12) return value;
  const out = value.replace(/var\(\s*(--[\w-]+)\s*(?:,\s*([^()]*(?:\([^()]*\))?[^()]*))?\)/g, (_, n, fb) =>
    tokens[n] !== undefined ? tokens[n] : fb !== undefined ? fb : '',
  );
  return /var\(/.test(out) && out !== value ? resolveVars(out, tokens, depth + 1) : out;
}

function parseColor(input) {
  const s = input.trim().toLowerCase();
  if (s === 'transparent') return { r: 0, g: 0, b: 0, a: 0 };
  if (s === 'white') return { r: 255, g: 255, b: 255, a: 1 };
  if (s === 'black') return { r: 0, g: 0, b: 0, a: 1 };
  let m = s.match(/^#([0-9a-f]{3,8})$/);
  if (m) {
    let h = m[1];
    if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join('');
    if (h.length !== 6 && h.length !== 8) return null;
    const n = (i) => parseInt(h.slice(i, i + 2), 16);
    return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) / 255 : 1 };
  }
  m = s.match(/^(rgba?|hsla?)\(([^)]*)\)$/);
  if (!m) return null;
  const parts = m[2].replace(/\s*\/\s*/, ' / ').split(/[\s,]+/).filter((p) => p && p !== '/');
  const alphaOf = (p) => (p === undefined ? 1 : p.endsWith('%') ? parseFloat(p) / 100 : parseFloat(p));
  if (m[1].startsWith('rgb')) {
    const ch = (p) => (p.endsWith('%') ? (parseFloat(p) * 255) / 100 : parseFloat(p));
    const [r, g, b] = parts.slice(0, 3).map(ch);
    if ([r, g, b].some(Number.isNaN)) return null;
    return { r, g, b, a: alphaOf(parts[3]) };
  }
  const hDeg = parseFloat(parts[0]);
  const sat = parseFloat(parts[1]) / 100;
  const lig = parseFloat(parts[2]) / 100;
  if ([hDeg, sat, lig].some(Number.isNaN)) return null;
  const k = (n) => (n + hDeg / 30) % 12;
  const f = (n) => lig - sat * Math.min(lig, 1 - lig) * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  return { r: f(0) * 255, g: f(8) * 255, b: f(4) * 255, a: alphaOf(parts[3]) };
}

const luminance = ({ r, g, b }) => {
  const lin = (c) => {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};
const composite = (fg, bg) => ({
  r: fg.r * fg.a + bg.r * (1 - fg.a),
  g: fg.g * fg.a + bg.g * (1 - fg.a),
  b: fg.b * fg.a + bg.b * (1 - fg.a),
  a: 1,
});
function contrast(fg, bg) {
  const top = fg.a < 1 ? composite(fg, bg) : fg;
  const [l1, l2] = [luminance(top), luminance(bg)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

/* --- Déclarations CSS des sources (global.css + <style> des .astro) --- */
const astroFiles = walk(SRC, (p) => p.endsWith('.astro'));
const globalCssPath = path.join(SRC, 'styles', 'global.css');
const cssSources = [
  { file: globalCssPath, css: read(globalCssPath) },
  ...astroFiles.flatMap((file) =>
    [...read(file).matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => ({ file, css: m[1] })),
  ),
];

function declarations(css) {
  const out = [];
  for (const m of stripCssComments(css).matchAll(/([-\w]+)\s*:\s*([^;{}]+)(?=[;}])/g)) {
    out.push({ prop: m[1].trim(), value: m[2].trim() });
  }
  return out;
}

/* Jetons utilisés comme couleur de texte (en suivant les alias locaux). */
const localAssignments = {};
const colorValues = [];
for (const { file, css } of cssSources) {
  for (const d of declarations(css)) {
    if (d.prop.startsWith('--')) (localAssignments[d.prop] ??= []).push(d.value);
    if (d.prop === 'color') {
      colorValues.push({ file, value: d.value });
      if (/color-mix\(/i.test(d.value)) {
        err('thème', `${rel(file)} : color-mix() interdit dans « color: ${d.value} » (voir règle color-mix)`);
      }
    }
  }
}
function textTokensFromSources(themeTokens) {
  const found = new Set();
  const visit = (value, seen = new Set()) => {
    for (const m of value.matchAll(/var\(\s*(--[\w-]+)/g)) {
      const name = m[1];
      if (seen.has(name)) continue;
      seen.add(name);
      if (themeTokens[name] !== undefined) found.add(name);
      else for (const v of localAssignments[name] ?? []) visit(v, seen);
    }
  };
  colorValues.forEach(({ value }) => visit(value));
  return [...found];
}

function checkTheme(file) {
  const scope = `thème ${rel(file)}`;
  const tokens = parseTokens(read(file));
  for (const t of REQUIRED_TOKENS) if (tokens[t] === undefined) err(scope, `jeton obligatoire manquant : ${t}`);

  const color = (name) => {
    const raw = tokens[name];
    if (raw === undefined) return null;
    const c = parseColor(resolveVars(raw, tokens));
    if (!c) err(scope, `${name} : couleur non reconnue (« ${raw} ») — utiliser hex, rgb() ou hsl()`);
    return c;
  };

  const bgs = {};
  for (const b of OPAQUE_BGS) {
    const c = color(b);
    if (!c) continue;
    if (c.a < 1) err(scope, `${b} doit être opaque`);
    bgs[b] = c;
  }
  const pair = (fgName, bgName, min, what) => {
    const fg = color(fgName);
    const bg = bgs[bgName] ?? color(bgName);
    if (!fg || !bg) return;
    const ratio = contrast(fg, bg);
    if (args.has('--verbose')) console.log(`  ${rel(file)}  ${fgName} / ${bgName} : ${ratio.toFixed(2)}:1 (min ${min})`);
    if (ratio + 1e-9 < min) {
      err(scope, `contraste ${fgName} sur ${bgName} = ${ratio.toFixed(2)}:1 < ${min}:1 (${what})`);
    }
  };

  for (const t of TEXT_TOKENS) for (const b of OPAQUE_BGS) pair(t, b, 4.5, 'texte');
  for (const b of ON_BACKGROUND['--c-text-on-accent']) pair('--c-text-on-accent', b, 4.5, 'texte sur accent');
  pair('--c-accent', '--c-bg', 3, 'élément d’interface');

  for (const t of textTokensFromSources(tokens)) {
    if (TEXT_TOKENS.includes(t)) continue;
    const targets = ON_BACKGROUND[t] ?? OPAQUE_BGS;
    for (const b of targets) pair(t, b, 4.5, 'jeton utilisé comme couleur de texte');
  }
  checkThemeFonts(file, scope, tokens);
}

/* --- Polices auto-hébergées --- */
const GOOGLE_FONTS = /fonts\.(googleapis|gstatic)\.com/i;
const SYSTEM_FONTS = new Set([
  'system-ui', '-apple-system', 'blinkmacsystemfont', 'ui-sans-serif', 'ui-serif', 'ui-monospace', 'ui-rounded',
  'sans-serif', 'serif', 'monospace', 'cursive', 'fantasy', 'inherit',
  'arial', 'arial narrow', 'helvetica', 'helvetica neue', 'segoe ui', 'roboto', 'georgia', 'times new roman',
  'verdana', 'tahoma', 'trebuchet ms', 'haettenschweiler', 'impact', 'menlo', 'consolas', 'sfmono-regular', 'cascadia mono',
]);
function resolveCssImport(spec, fromFile) {
  if (spec.startsWith('.')) return path.resolve(path.dirname(fromFile), spec);
  const m = spec.match(/^((?:@[^/]+\/)?[^/]+)(\/.+)?$/);
  if (!m) return null;
  const dir = path.join(ROOT, 'node_modules', m[1]);
  if (m[2]) return path.join(dir, m[2].endsWith('.css') ? m[2] : `${m[2]}.css`);
  const pkg = path.join(dir, 'package.json');
  if (!fs.existsSync(pkg)) return null;
  const main = JSON.parse(read(pkg)).main ?? 'index.css';
  return path.join(dir, main.endsWith('.css') ? main : 'index.css');
}
function checkThemeFonts(file, scope, tokens) {
  const css = stripCssComments(read(file));
  if (GOOGLE_FONTS.test(css)) err(scope, 'URL Google Fonts interdite : auto-héberger les polices (@import de @fontsource-variable/…)');
  const provided = new Set();
  for (const m of css.matchAll(/@import\s+(?:url\(\s*)?['"]([^'"]+)['"]/g)) {
    const spec = m[1];
    if (/^(https?:)?\/\//.test(spec)) {
      err(scope, `@import externe interdit : « ${spec} » (les polices doivent être auto-hébergées)`);
      continue;
    }
    const target = resolveCssImport(spec, file);
    if (!target || !fs.existsSync(target)) {
      err(scope, `@import « ${spec} » introuvable — lancer npm install (paquet absent de package.json ?)`);
      continue;
    }
    for (const ff of read(target).matchAll(/font-family:\s*['"]?([^;'"]+?)['"]?\s*;/g)) provided.add(ff[1].trim().toLowerCase());
  }
  for (const t of ['--font-display', '--font-body', '--font-label']) {
    if (tokens[t] === undefined) continue;
    const first = resolveVars(tokens[t], tokens).split(',')[0].trim().replace(/^['"]|['"]$/g, '');
    if (!provided.has(first.toLowerCase()) && !SYSTEM_FONTS.has(first.toLowerCase())) {
      err(scope, `${t} : la famille « ${first} » n’est fournie par aucun @import du thème (ex. @import '@fontsource-variable/inter' => « Inter Variable »)`);
    }
  }
}

const themeFiles = [
  path.join(SRC, 'styles', 'theme.css'),
  ...walk(path.join(SRC, 'styles', 'themes'), (p) => p.endsWith('.css')),
];
themeFiles.forEach((f) => (fs.existsSync(f) ? checkTheme(f) : err('thème', `fichier manquant : ${rel(f)}`)));

/* --- Couleurs en dur hors du thème --- */
const NAMED = /\b(white|black|red|green|blue|gray|grey|orange|yellow|purple|pink|silver|navy|teal|maroon|olive|lime|aqua|fuchsia)\b/i;
function hardColor(value) {
  const v = value.replace(/var\([^)]*\)/g, '');
  if (/#[0-9a-f]{3,8}\b/i.test(v)) return 'hex';
  if (/\b(rgba?|hsla?|hwb|lab|lch|oklab|oklch)\(/i.test(v)) return 'fonction de couleur';
  if (NAMED.test(v)) return 'nom de couleur';
  return '';
}
for (const { file, css } of cssSources) {
  for (const d of declarations(css)) {
    if (d.prop.startsWith('--')) {
      if (hardColor(d.value)) err('couleur en dur', `${rel(file)} : ${d.prop}: ${d.value} (définir le jeton dans theme.css)`);
      continue;
    }
    const kind = hardColor(d.value);
    if (kind) err('couleur en dur', `${rel(file)} : « ${d.prop}: ${d.value} » (${kind}) — utiliser un jeton de theme.css`);
  }
}
for (const file of astroFiles) {
  const markup = read(file).replace(/^---[\s\S]*?\n---/, '').replace(/<style[\s\S]*?<\/style>/g, '');
  for (const m of markup.matchAll(/\s(fill|stroke|stop-color|color)="([^"]*)"/g)) {
    if (/var\(|#|rgb|hsl/i.test(m[2])) {
      err('couleur en dur', `${rel(file)} : attribut SVG ${m[1]}="${m[2]}" — poser la couleur en CSS (classe), jamais en attribut`);
    }
  }
  for (const m of markup.matchAll(/\sstyle="([^"]*)"/g)) {
    if (hardColor(m[1])) err('couleur en dur', `${rel(file)} : style="${m[1]}"`);
  }
}

/* ================================================================ 4. SOURCES */

const stripEntities = (s) => s.replace(/&[a-z]+;|&#\d+;/gi, ' ');
function hardcodedText(src) {
  const found = [];
  let s = src.replace(/^---[\s\S]*?\n---/, '');
  // Balises <script … /> auto-fermantes d'abord (sinon la suppression irait jusqu'au </script> suivant).
  s = s.replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<script\b[^>]*\/>/g, ' ').replace(/<script[\s\S]*?<\/script>/g, ' ');
  s = s.replace(/\{\/\*[\s\S]*?\*\/\}/g, ' ');
  let previous;
  do {
    previous = s;
    s = s.replace(/\{([^{}]*)\}/g, (_, inner) => {
      // Texte JSX dans une expression : >texte< (on ignore la flèche => et la reprise
      // du code JavaScript après un élément : « ) : ( », « ) } », etc.).
      for (const m of inner.matchAll(/(^|[^=])>([^<>]*)</g)) {
        const text = m[2].trim();
        if (/^[)\]}:?,;|&]/.test(text)) continue;
        if (/\p{L}/u.test(stripEntities(text))) found.push(text);
      }
      return ' ';
    });
  } while (s !== previous);
  s = stripEntities(s.replace(/<[^>]*>/g, ' '));
  for (const line of s.split('\n')) if (/\p{L}/u.test(line)) found.push(line.trim());
  return found;
}
for (const file of astroFiles) {
  const markupOnly = read(file).replace(/^---[\s\S]*?\n---/, '').replace(/<script\b[^>]*\/>/g, '').replace(/<(script|style)[\s\S]*?<\/\1>/g, '');
  if (/<!--/.test(markupOnly)) {
    err('sources', `${rel(file)} : commentaire HTML <!-- (publié selon le contexte) — utiliser {/* */} ou le frontmatter`);
  }
  for (const text of hardcodedText(read(file))) {
    err('texte en dur', `${rel(file)} : « ${text.slice(0, 80)} » — déplacer ce texte dans src/data/content.ts`);
  }
}

/* Helper placeholder unique */
for (const file of walk(SRC, (p) => /\.(ts|astro|mjs|js)$/.test(p))) {
  if (rel(file) === 'src/lib/utils.ts') continue;
  const code = read(file);
  if (/startsWith\(\s*['"`]TODO/.test(code) || /\b(affichable|isReal)\s*=/.test(code)) {
    err('sources', `${rel(file)} : test de placeholder local — utiliser isSet() de src/lib/utils.ts`);
  }
}

/* Icônes citées dans content.ts */
const iconSrc = read(path.join(SRC, 'components', 'Icon.astro'));
const iconNames = new Set([...iconSrc.matchAll(/^\s*'([\w-]+)':\s*'</gm)].map((m) => m[1]));
const contentSrc = read(path.join(SRC, 'data', 'content.ts'));
const iconRefs = [...contentSrc.matchAll(/\bicon:\s*'([\w-]+)'/g)].map((m) => m[1]);
for (const m of contentSrc.matchAll(/\bicons:\s*\{([^}]*)\}/g)) {
  for (const n of m[1].matchAll(/:\s*'([\w-]+)'/g)) iconRefs.push(n[1]);
}
for (const name of iconRefs) {
  if (!iconNames.has(name)) err('sources', `content.ts : icône inconnue « ${name} » (absente de Icon.astro)`);
}

/* Vocabulaire interdit */
const MEDICAL = /\b(soigner|soigne|soignez|guérir|guérit|guérison|traiter|thérapie|thérapies|thérapeutique|thérapeutiques|sport sur ordonnance|activité physique adaptée|perte de poids|maigrir|brûle-graisses?|détox)\b/i;
const PROMISE = /\b(garanti|garantie|garantis|garanties|offert|offerte|offerts|offertes|gratuit|gratuite|gratuits|gratuites|satisfait ou remboursé|sans engagement|résultats? assurés?)\b/i;
const PERIMETER = /\bCGV\b|conditions générales de vente|paiement en ligne|\btarifs?\b|\bforfaits?\b|\bprix\b/i;
function walkStrings(value, visit, keyPath = '') {
  if (typeof value === 'string') visit(value, keyPath);
  else if (typeof value === 'function') return;
  else if (Array.isArray(value)) value.forEach((v, i) => walkStrings(v, visit, `${keyPath}[${i}]`));
  else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) walkStrings(v, visit, keyPath ? `${keyPath}.${k}` : k);
  }
}
for (const [name, value] of Object.entries(content)) {
  walkStrings(value, (s, p) => {
    if (MEDICAL.test(s)) err('contenu', `content.${name}${p ? `.${p}` : ''} : vocabulaire médical interdit (« ${s.match(MEDICAL)[0]} »)`);
    const isFactual = ['testimonials', 'credentials', 'stats', 'legal'].includes(name);
    if (PERIMETER.test(s)) err('périmètre', `content.${name}${p ? `.${p}` : ''} : hors périmètre (« ${s.match(PERIMETER)[0]} ») — ni prix, ni tarif, ni paiement en ligne, ni CGV`);
    if (!isFactual && PROMISE.test(s)) {
      err('contenu', `content.${name}.${p} : promesse commerciale (« ${s.match(PROMISE)[0]} ») — à placer dans site.booking.ctaNote si elle est réelle`);
    }
  });
}

/* Cohérence de site.ts */
const cnamePath = path.join(ROOT, 'public', 'CNAME');
const cname = fs.existsSync(cnamePath) ? read(cnamePath).trim() : '';
if (isSet(site.url)) {
  if (!/^https:\/\/[^/]+$/.test(site.url)) err('site.ts', `url « ${site.url} » : attendu https://domaine sans barre finale`);
  else if (cname && new URL(site.url).hostname !== cname) err('site.ts', `url (${new URL(site.url).hostname}) ≠ public/CNAME (${cname})`);
}
if (isSet(site.contact.email) && !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(site.contact.email)) err('site.ts', `contact.email invalide : ${site.contact.email}`);
if (isSet(site.legal.siret) && !/^\d{14}$/.test(site.legal.siret.replace(/\s/g, ''))) err('site.ts', `legal.siret doit comporter 14 chiffres : ${site.legal.siret}`);
if (isSet(site.seo.ogImage) && !fs.existsSync(path.join(ROOT, 'public', site.seo.ogImage.replace(/^\//, '')))) {
  err('site.ts', `seo.ogImage « ${site.seo.ogImage} » introuvable dans public/`);
}
for (const [k, v] of Object.entries(site.social)) {
  if (isSet(v) && !/^https:\/\//.test(v)) err('site.ts', `social.${k} doit être une URL https:// complète`);
}
if (isSet(site.booking.calendlyUrl) && !/^https:\/\/calendly\.com\//.test(site.booking.calendlyUrl)) {
  err('site.ts', 'booking.calendlyUrl doit commencer par https://calendly.com/');
}
if (!Object.values(site.contact.modes).some(Boolean)) err('site.ts', 'contact.modes : au moins un format doit être proposé');
const NAV_EXPECTED = ['/', '/a-propos', '/services', '/reservation', '/contact'];
const navHrefs = site.nav.map((n) => n.href);
if (navHrefs.join('|') !== NAV_EXPECTED.join('|')) {
  err('périmètre', `site.nav doit contenir exactement les 5 pages ${NAV_EXPECTED.join(', ')} (trouvé : ${navHrefs.join(', ')})`);
}
const LEGAL_PAGES = ['/mentions-legales', '/confidentialite'];
for (const href of LEGAL_PAGES) {
  if (!site.legalNav.some((n) => n.href === href)) err('site.ts', `legalNav doit contenir ${href}`);
}

/* ================================================================== 5. DIST */

const htmlFiles = walk(DIST, (p) => p.endsWith('.html'));
if (htmlFiles.length === 0) err('dist', 'aucune page générée dans dist/');

const pageOf = (file) => {
  const r = rel(file).replace(/^dist\//, '');
  if (r === 'index.html') return '/';
  return `/${r.replace(/\/index\.html$/, '').replace(/\.html$/, '')}`;
};
for (const file of walk(DIST, (p) => /\.(html|css|js|mjs|json|xml|txt|svg)$/.test(p))) {
  if (GOOGLE_FONTS.test(read(file))) err('polices', `${rel(file)} : URL fonts.googleapis.com / fonts.gstatic.com — les polices doivent être auto-hébergées`);
}
const pages = new Map();
for (const file of htmlFiles) {
  const raw = read(file);
  const jsonLd = [...raw.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const html = raw.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ');
  const ids = [...html.matchAll(/\sid="([^"]*)"/g)].map((m) => decode(m[1]));
  pages.set(pageOf(file), { file, raw, html, jsonLd, ids: new Set(ids), idList: ids });
}

function resolveTarget(href) {
  const [pathPart] = href.split(/[?#]/);
  let p = decodeURI(pathPart).replace(/\/+$/, '') || '/';
  if (pages.has(p)) return pages.get(p);
  const asset = path.join(DIST, p);
  if (fs.existsSync(asset) && fs.statSync(asset).isFile()) return { asset: true };
  return null;
}

const FORBIDDEN = [
  [/\bTODO/, 'TODO'],
  [/\bundefined\b/i, 'undefined'],
  [/\bnull\b/i, 'null'],
  [/\bNaN\b/, 'NaN'],
  [/\[object Object\]/, '[object Object]'],
  [/lorem/i, 'lorem'],
];
const optionalSeen = new Map();
let missingLegal = 0;

for (const [page, { raw, html, jsonLd, ids, idList }] of pages) {
  const scope = `dist ${page}`;

  for (const m of raw.matchAll(/<(script|link)\b[^>]*\s(?:src|href)="[^"]*calendly\.com[^"]*"/gi)) {
    err(scope, `<${m[1]}> Calendly dans le HTML initial — le widget ne doit être chargé qu’après un clic`);
  }
  for (const href of LEGAL_PAGES) {
    if (!raw.includes(`href="${href}"`)) err(scope, `lien vers ${href} absent (pied de page)`);
  }

  if (/<!--/.test(html)) err(scope, 'commentaire HTML <!-- publié (utiliser un commentaire de frontmatter ou {/* */})');

  const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1 !== 1) err(scope, `${h1} <h1> (exactement 1 attendu)`);

  for (const m of html.matchAll(/<(h[1-6]|p|li|ul|ol|dd|dt|a|button)(\s[^>]*)?>\s*<\/\1>/g)) {
    err(scope, `élément <${m[1]}> vide`);
  }

  const dup = idList.filter((id, i) => idList.indexOf(id) !== i);
  if (dup.length) err(scope, `ids en double : ${[...new Set(dup)].join(', ')}`);

  for (const m of html.matchAll(/\shref="([^"]*)"/g)) {
    const href = decode(m[1]);
    if (href.startsWith('//')) continue;
    if (href === '#' || href === '') {
      err(scope, `lien vide href="${href}"`);
    } else if (href.startsWith('#')) {
      if (!ids.has(href.slice(1))) err(scope, `ancre morte ${href}`);
    } else if (href.startsWith('/')) {
      const target = resolveTarget(href);
      const hash = href.includes('#') ? href.split('#')[1] : '';
      if (!target) err(scope, `lien interne mort ${href}`);
      else if (hash && (target.asset || !target.ids.has(hash))) err(scope, `ancre morte ${href}`);
    }
  }
  for (const m of html.matchAll(/\saria-(labelledby|controls|describedby)="([^"]*)"/g)) {
    for (const id of m[2].split(/\s+/).filter(Boolean)) {
      if (!ids.has(id)) err(scope, `aria-${m[1]} référence un id absent : ${id}`);
    }
  }

  for (const block of jsonLd) {
    try {
      const data = JSON.parse(block);
      walkStrings(data, (s, p) => {
        for (const [re, label] of FORBIDDEN) if (re.test(s)) err(scope, `JSON-LD ${p} contient « ${label} »`);
      });
      JSON.stringify(data, (k, v) => {
        if (v === null) err(scope, `JSON-LD : valeur null (${k})`);
        return v;
      });
    } catch {
      err(scope, 'JSON-LD invalide');
    }
  }

  const textNodes = [...html.matchAll(/>([^<]+)</g)].map((m) => decode(m[1])).filter((t) => t.trim());
  const attrValues = [...html.matchAll(/\s([\w:-]+)="([^"]*)"/g)].map((m) => ({ name: m[1], value: decode(m[2]) }));
  const readable = [
    ...textNodes,
    ...attrValues.filter((a) => ['aria-label', 'alt', 'title', 'content'].includes(a.name) && !/^(https?:|data:|width=)/.test(a.value)).map((a) => a.value),
  ];

  for (const t of [...textNodes, ...attrValues.map((a) => a.value)]) {
    for (const [re, label] of FORBIDDEN) if (re.test(t)) err(scope, `occurrence de « ${label} » : « ${t.trim().slice(0, 80)} »`);
  }

  for (const t of readable) {
    const excerpt = t.trim().slice(0, 90);
    if (/ [:;!?]/.test(t)) err(scope, `espace ordinaire avant : ; ! ? (espace insécable attendue) : « ${excerpt} »`);
    if (/[^\s  ]:(?!\/\/)(?=[\s ]|$)/.test(t) || /[^\s  (][;!?](?=[\s ]|$)/.test(t)) {
      err(scope, `espace insécable manquante avant : ; ! ? : « ${excerpt} »`);
    }
    if (/'/.test(t)) err(scope, `apostrophe droite (utiliser ’) : « ${excerpt} »`);
    if (/«(?![  ])/.test(t) || /(?<![  ])»/.test(t)) err(scope, `guillemets « » sans espace insécable : « ${excerpt} »`);
    if (PERIMETER.test(t)) err(scope, `hors périmètre (« ${t.match(PERIMETER)[0]} ») : « ${excerpt} »`);
    if (MEDICAL.test(t)) err(scope, `vocabulaire médical interdit (« ${t.match(MEDICAL)[0]} ») : « ${excerpt} »`);
  }

  for (const m of html.matchAll(/\sdata-optional="([^"]+)"/g)) {
    optionalSeen.set(m[1], [...(optionalSeen.get(m[1]) ?? []), page]);
  }
  missingLegal += (html.match(/class="[^"]*\blegal-missing\b/g) ?? []).length;
}

if (pages.has('/conditions-generales-de-vente')) err('périmètre', 'page /conditions-generales-de-vente présente : hors périmètre');
if (htmlFiles.length) for (const p of [...NAV_EXPECTED, ...LEGAL_PAGES]) if (!pages.has(p)) err('dist', `page ${p} absente`);
if (isSet(site.booking.calendlyUrl) && !pages.get('/reservation')?.raw.includes('data-calendly-load')) {
  err('dist /reservation', 'calendlyUrl renseigné mais bouton « Afficher le calendrier de réservation » absent');
}

/* Sections optionnelles : présentes si et seulement si les données existent */
const socialNoWa = ['instagram', 'facebook', 'tiktok', 'youtube', 'linkedin'].some((k) => isSet(site.social[k]));
const EXPECTED = {
  testimonials: content.testimonials.some((t) => isSet(t.text) && isSet(t.author)),
  credentials: content.credentials.some((c) => isSet(c.title)),
  stats: content.stats.some((s) => isSet(s.value) && isSet(s.label)),
  'cta-note': isSet(site.booking.ctaNote),
  social: socialNoWa || isSet(site.social.whatsapp),
  whatsapp: isSet(site.social.whatsapp),
  coach: isSet(site.coach.name),
  practical: isSet(site.contact.responseTime) || isSet(site.contact.hours),
};
for (const [key, expected] of Object.entries(EXPECTED)) {
  const seen = optionalSeen.get(key) ?? [];
  if (!expected && seen.length) err('sections optionnelles', `« ${key} » affiché (${seen.join(', ')}) alors que les données sont vides`);
  if (expected && seen.length === 0) err('sections optionnelles', `« ${key} » renseigné mais jamais affiché`);
}
for (const key of optionalSeen.keys()) {
  if (!(key in EXPECTED)) err('sections optionnelles', `marqueur data-optional="${key}" inconnu de check.mjs`);
}

/* ========================================================= 6. AVERTISSEMENTS */

const TODO_FIELDS = [
  ['brand.name', 'nom de la marque'],
  ['url', 'URL publique du site (https://…)'],
  ['coach.name', 'nom du coach (page À propos)'],
  ['coach.status', 'statut / titre du coach réellement détenu'],
  ['contact.email', 'e-mail professionnel'],
  ['contact.phone', 'téléphone'],
  ...(site.contact.modes.inPerson ? [['contact.city', 'ville des séances en présentiel']] : []),
  ['booking.calendlyUrl', 'lien Calendly (sinon réservation par message)'],
  ['seo.ogImage', 'image de partage 1200×630 dans public/'],
  ['legal.businessName', 'mentions légales : nom ou raison sociale'],
  ['legal.legalForm', 'mentions légales : forme juridique'],
  ['legal.siret', 'mentions légales : SIRET'],
  ['legal.address', 'mentions légales : adresse'],
  ['legal.publicationDirector', 'mentions légales : directeur de la publication'],
  ['legal.lastUpdated', 'confidentialité : date de mise à jour'],
];
const get = (obj, p) => p.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
for (const [p, label] of TODO_FIELDS) if (!isSet(get(site, p))) warnings.push(`site.${p} — ${label}`);
if (!cname) warnings.push('public/CNAME — domaine personnalisé (ex. exemple.shop)');
if (missingLegal > 0) warnings.push(`pages légales — ${missingLegal} mention(s) affichée(s) « (à compléter) »`);

const OPTIONAL_FIELDS = [
  ['booking.ctaNote', 'note sous les boutons (offre réellement pratiquée)'],
  ['contact.responseTime', 'délai de réponse réellement tenu'],
  ['contact.hours', 'horaires de joignabilité'],
  ['contact.area', 'zone couverte en présentiel'],
  ['legal.registration', 'mentions légales : immatriculation RCS / RM (sociétés, artisans)'],
  ['legal.shareCapital', 'mentions légales : capital social (sociétés)'],
  ['legal.vatNumber', 'mentions légales : n° de TVA intracommunautaire (si assujetti)'],
];
for (const [p, label] of OPTIONAL_FIELDS) if (!isSet(get(site, p))) optionalInfo.push(`site.${p} — ${label}`);
if (!Object.values(site.social).some((v) => isSet(v))) optionalInfo.push('site.social — aucun réseau social');
if (!EXPECTED.testimonials) optionalInfo.push('content.testimonials — vide (section masquée)');
if (!EXPECTED.credentials) optionalInfo.push('content.credentials — vide (section masquée)');
if (!EXPECTED.stats) optionalInfo.push('content.stats — vide (section masquée)');

/* ================================================================ 7. RAPPORT */

console.log('\n==================== npm run check ====================');
console.log(`Pages analysées : ${pages.size} · thèmes contrôlés : ${themeFiles.length}`);

if (warnings.length) {
  console.log(`\nAVERTISSEMENTS — à renseigner avant mise en production (${warnings.length}) :`);
  warnings.forEach((w) => console.log(`  - [ ] ${w}`));
}
if (optionalInfo.length) {
  console.log(`\nFacultatif — vide, donc masqué (${optionalInfo.length}) :`);
  optionalInfo.forEach((w) => console.log(`  - [ ] ${w}`));
}
if (errors.length) {
  console.log(`\nERREURS (${errors.length}) :`);
  errors.forEach((e) => console.log(`  ✗ ${e}`));
  console.log('\nRésultat : ÉCHEC');
  process.exit(1);
}
console.log('\nERREURS : aucune');
console.log('Résultat : OK');

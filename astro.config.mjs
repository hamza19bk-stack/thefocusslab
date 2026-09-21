import { defineConfig } from 'astro/config';
import { site } from './src/data/site.ts';
import { isSet } from './src/lib/utils.ts';

// Domaine personnalisé sur GitHub Pages : `site` vient de src/data/site.ts (champ url),
// base reste '/'. Rien à modifier ici pour un nouveau site.
export default defineConfig({
  site: isSet(site.url) ? site.url : undefined,
  trailingSlash: 'ignore',
  build: { format: 'directory' },
});

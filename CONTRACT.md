# CONTRAT — thème et données du template

Référence technique pour modifier le template sans casser la série de sites. La méthode pas à pas
pour créer un site est dans [FORMULE.md](FORMULE.md). Tout ce qui est écrit ici est vérifié par
`npm run check` (détail en tête de `scripts/check.mjs`).

---

## 1. Architecture

| Fichier | Rôle | Modifié pour un nouveau site ? |
|---|---|---|
| `src/data/site.ts` | faits : marque, URL, coach, contact, formats, réseaux, Calendly, navigation, SEO, mentions légales | **oui** |
| `src/data/content.ts` | tout le texte visible, y compris les pages légales et la 404 | **oui** (reformulation) |
| `src/styles/theme.css` | identité visuelle : couleurs, polices, rayons, ombres, halos | **oui** (accent) |
| `public/CNAME` | domaine seul | **oui** |
| `src/lib/utils.ts` | `isSet`, `nb`, `phoneHref` | non |
| `src/lib/data.ts` | sélecteurs (offres actives, FAQ filtrées, `mailto`…) | non |
| `src/lib/theme.ts` | lit `theme.css` au build (favicon, `theme-color`) | non |
| `src/layouts/Base.astro` | `<head>`, SEO, JSON-LD, en-tête, pied de page | non |
| `src/components/*` | Header, Footer, Section, Faq, CtaBand, Icon, LegalPage | non |
| `src/pages/*` | 5 pages + `/mentions-legales`, `/confidentialite`, 404 | non |

**Pages** : la navigation principale (`site.nav`) contient exactement `/`, `/a-propos`, `/services`,
`/reservation`, `/contact`. Les pages légales sont liées **uniquement** depuis le pied de page
(`site.legalNav`), qui affiche aussi « © année du build ».

**Hors périmètre, refusé par le contrôle** : prix, tarifs, forfaits, paiement en ligne,
CGV, formulaire, blog.

---

## 2. Règles des sources

1. **Aucun texte en dur dans les `.astro`** : tout texte vient de `content.ts` ou `site.ts`.
2. **Aucun commentaire HTML `<!-- -->`** dans un `.astro` (il serait publié) : frontmatter ou `{/* */}`.
3. **Un seul helper de placeholder** : `isSet(v)` (`src/lib/utils.ts`). Non renseigné = `undefined`,
   `null`, `''` (ou espaces), ou toute chaîne commençant par `TODO`. Une valeur non renseignée n'est
   jamais affichée ; exception : les pages légales affichent `ui.legalMissing` (« (à compléter) »)
   pour une mention **obligatoire** manquante.
4. **Aucune couleur en dur** hors de `theme.css` : ni dans `global.css`, ni dans un `<style>`, ni en
   attribut SVG (`fill`, `stroke`) ; `color-mix()` est interdit dans une déclaration `color:`.
5. **Typographie** : `’`, « » avec insécables, insécable avant `: ; ! ?`. Dans une chaîne JS ou une
   prop, écrire `${nb}` (U+00A0) : `&nbsp;` n'y est pas décodé.
6. **Aucune ressource tierce au chargement** : polices auto-hébergées ; le widget Calendly n'est
   injecté qu'après un clic (aucun `<script src>` ni `<link href>` Calendly dans le HTML).

---

## 3. Données : `src/data/site.ts`

Toutes les valeurs factuelles sont **vides par défaut** avec un commentaire `// TODO`.

| Clé | Type | Effet si vide |
|---|---|---|
| `brand.name` | string | logo « Coaching sportif » (`ui.brandFallback`), pas de JSON-LD d'entreprise |
| `brand.tagline` | string | pas de sur-titre en pied de page ni de `description` JSON-LD |
| `url` | `https://domaine` | pas de canonique ni d'Open Graph absolu ; doit égaler `public/CNAME` |
| `coach.name` / `coach.status` | string | plaque du portrait et JSON-LD de profil absents |
| `contact.email` / `phone` | string | cartes, boutons et lignes correspondants absents |
| `contact.city` / `area` | string | textes de repli sans lieu |
| `contact.responseTime` / `hours` | string | encart « En pratique » absent |
| `contact.modes.inPerson/online/remote` | boolean | `false` : offre, puces, FAQ et cartes du format masquées |
| `social.*` | URL https | lien absent ; `whatsapp` pilote aussi la carte WhatsApp |
| `booking.calendlyUrl` | URL `https://calendly.com/…` | réservation par message (ou message neutre sans coordonnée) |
| `booking.ctaLabel` / `ctaShortLabel` | string | libellés des boutons |
| `booking.ctaNote` | string | aucune note sous les boutons |
| `nav` / `legalNav` | `{label, href}[]` | contenu imposé (voir §1) |
| `seo.ogImage` | chemin dans `public/` | pas de balise `og:image` |
| `seo.keywords` | string[] | balise `keywords` |
| `legal.businessName`, `legalForm`, `siret`, `address`, `publicationDirector` | string | « (à compléter) » sur les pages légales |
| `legal.registration`, `shareCapital`, `vatNumber` | string | ligne absente (facultatif selon le statut) |
| `legal.lastUpdated` | string | « (à compléter) » sur la politique de confidentialité |
| `legal.host` | objet | GitHub, Inc. pré-rempli (coordonnées publiques) |

L'e-mail et le téléphone de l'éditeur (mentions légales) sont ceux de `contact`.

---

## 4. Données : `src/data/content.ts`

| Export | Contenu |
|---|---|
| `ui` | micro-copy partagée (menu, pied de page, rappel santé, libellés) |
| `modeLabels` | libellés des 3 formats |
| `offers` | les 4 offres : `presentiel` (mode `inPerson`), `visio` (`online`), `programme` (`remote`), `nutrition` (toujours proposée). Champs : `id`, `mode`, `icon`, `short`, `title`, `summary`, `description`, `includes[]`, `forWho`, `note?`, `ctaLabel`, `ctaTarget` (`booking` ou `contact`). **Aucun prix.** |
| `home`, `about`, `services`, `booking`, `contact`, `notFound` | textes de chaque page (`seo`, `hero`, sections, FAQ, `cta`) |
| `legal.mentions`, `legal.privacy` | sections des pages légales (`LegalSection` : `title`, `id?`, `paragraphs?`, `rows?`, `list?`, `links?`, `link?`) |
| `testimonials`, `credentials`, `stats` | **vides par défaut** ; uniquement des faits réels |

Icônes : chaque `icon` doit exister dans `src/components/Icon.astro`.

Contenus interdits dans `content.ts` (erreur du contrôle) : vocabulaire médical (soigner, guérir,
traiter, thérapie, perte de poids, maigrir, sport sur ordonnance, activité physique adaptée…),
promesses (offert, gratuit, garanti, sans engagement, satisfait ou remboursé…), hors périmètre
(prix, tarif, forfait, paiement en ligne, CGV).

### Sections optionnelles (`data-optional`)

Présentes **si et seulement si** leurs données existent :

| Marqueur | Donnée |
|---|---|
| `testimonials` | `content.testimonials` |
| `credentials` | `content.credentials` |
| `stats` | `content.stats` |
| `cta-note` | `site.booking.ctaNote` |
| `social` | `site.social.*` |
| `whatsapp` | `site.social.whatsapp` |
| `coach` | `site.coach.name` |
| `practical` | `site.contact.responseTime` ou `hours` |

---

## 5. Thème : `src/styles/theme.css`

Exemples prêts à copier : `src/styles/themes/theme-dark.example.css` (thème actif par défaut,
identique au site d'origine) et `theme-light.example.css`. Les deux sont contrôlés.

### Polices (un seul endroit)

En tête de `theme.css` :

```css
@import '@fontsource-variable/inter';    /* famille « Inter Variable » */
@import '@fontsource-variable/oswald';   /* famille « Oswald Variable » */
```

puis `--font-display`, `--font-body` (et `--font-label`) commencent par ces familles. Pour changer :
`npm install @fontsource-variable/<nom>`, remplacer l'`@import` et le nom de famille. Le contrôle
vérifie que chaque `@import` existe, que la première famille de chaque jeton est fournie (ou est une
police système) et qu'aucune URL `fonts.googleapis.com` / `fonts.gstatic.com` n'apparaît.

### Jetons obligatoires

| Groupe | Jetons |
|---|---|
| Schéma | `--color-scheme` |
| Fonds (opaques) | `--c-bg`, `--c-bg-deep`, `--c-surface`, `--c-surface-2`, `--c-surface-3` |
| Bordures et voiles | `--c-border`, `--c-border-strong`, `--c-overlay`, `--c-overlay-alt`, `--c-grid-line`, `--c-shadow` |
| Textes | `--c-text`, `--c-text-soft`, `--c-text-muted`, `--c-text-faint` (décor), `--c-text-on-accent` |
| Accents | `--c-accent`, `--c-accent-bright`, `--c-accent-dim`, `--c-accent-soft`, `--c-accent-2`, `--c-accent-2-soft` |
| Halos et dégradés | `--halo-1`, `--halo-2`, `--halo-strength`, `--grad-accent`, `--grad-surface`, `--grad-line`, `--grad-visual` |
| Ombres | `--shadow-xs`, `--shadow-s`, `--shadow-m`, `--shadow-l`, `--shadow-accent`, `--ring` |
| Impression | `--c-print-bg`, `--c-print-text` |
| Polices | `--font-display`, `--font-label`, `--font-body`, `--font-mono` |
| Rayons | `--radius-xs`, `--radius-s`, `--radius-m`, `--radius-l`, `--radius-xl`, `--radius-pill`, `--radius-btn` |
| Style | `--heading-transform`, `--heading-weight`, `--heading-tracking`, `--display-leading`, `--label-transform` |

Couleurs en hex, `rgb()`/`rgba()` ou `hsl()`/`hsla()`, éventuellement via `var()`.

### Contrastes (WCAG 2.x, calculés par le contrôle)

- `--c-text`, `--c-text-soft`, `--c-text-muted` : ≥ 4,5:1 sur les 4 fonds opaques ;
- `--c-text-on-accent` : ≥ 4,5:1 sur `--c-accent` et `--c-accent-bright` ;
- `--c-accent` : ≥ 3:1 sur `--c-bg` ;
- tout jeton utilisé dans une déclaration `color:` : ≥ 4,5:1 sur les 4 fonds.

`node scripts/check.mjs --no-build --verbose` affiche tous les ratios.

---

## 6. Vie privée

- Le site ne dépose **aucun cookie** et n'a **aucun formulaire** ni outil de mesure d'audience.
- Polices servies depuis le site (`dist/_astro/*.woff2`).
- `/reservation` : encart d'information, bouton « Afficher le calendrier de réservation » (masqué sans
  JavaScript) et lien direct vers Calendly (nouvel onglet). Le script et la feuille de style Calendly
  ne sont injectés qu'au clic, puis le focus passe sur le calendrier. Sans `calendlyUrl`, aucun module
  ni script actif.
- Tout ajout d'un service tiers (statistiques, vidéo intégrée, pixel…) impose de mettre à jour
  `legal.privacy` dans `content.ts`, et le cas échéant un recueil du consentement.

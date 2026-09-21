# Template — site vitrine de coaching sportif

Site statique [Astro 5](https://astro.build) publié sur **GitHub Pages** avec un domaine personnalisé
(`public/CNAME`). C'est la base commune des sites de la série (focusla.shop et les suivants) : mêmes
5 pages (Accueil, À propos, Services, Réservation, Contact), même design, réservation via Calendly.
Pas de formulaire, pas de prix, pas de blog, pas de paiement en ligne.

```bash
npm install
npm run dev      # http://localhost:4321
npm run check    # build + contrôle qualité : doit finir sur « Résultat : OK »
```

- **Créer un site de la série** : [FORMULE.md](FORMULE.md) (copie, personnalisation, publication, DNS, checklist).
- **Référence technique** (jetons du thème, données, règles vérifiées) : [CONTRACT.md](CONTRACT.md).

Un nouveau site ne modifie que `src/data/site.ts`, `src/data/content.ts`, `src/styles/theme.css`
et `public/CNAME`.

Règles de contenu : rien d'inventé présenté comme réel, aucune promesse non confirmée, aucune
allégation médicale, jamais de texte provisoire publié. Les pages légales sont des modèles à relire
pour chaque site.

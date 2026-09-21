# FORMULE — créer un site de la série

Chaque site de la série (focusla, focuspaath, focusacademy, focofslow, focusmode, focuszen, focusty,
focusive, focusio, focur, focusra…) est **le même site vitrine de coaching sportif** : mêmes 5 pages
(Accueil, À propos, Services, Réservation, Contact), même design, réservation via Calendly.
D'un site à l'autre, seuls changent **le nom de marque, le domaine, la couleur d'accent et la
formulation des textes**.

Périmètre fixe : **pas** de formulaire de contact, **pas** de prix ni de tarifs, **pas** de blog,
**pas** de paiement en ligne. `npm run check` refuse tout ce qui en sort.

Toutes les commandes sont pour **Git Bash** sous Windows. Ouvre d'abord le terminal avec :

```bash
export PATH="$PATH:/c/Program Files/nodejs:/c/Program Files/GitHub CLI"
```

---

## 1. Copier le template

```bash
cd /c/Users/DELL/coaching-sites
NOM=focuspaath                 # nom du dossier et du dépôt GitHub
DOMAINE=focuspaath.shop        # domaine acheté chez Namecheap

mkdir "$NOM"
tar -C template --exclude=node_modules --exclude=dist --exclude=.astro --exclude=.git -cf - . | tar -C "$NOM" -xf -
cd "$NOM"
```

`node_modules`, `dist`, `.astro` et `.git` ne sont jamais copiés : ils sont recréés par
`npm install`, `npm run check` et `git init`.

---

## 2. Personnaliser : 3 fichiers et le CNAME

Rien d'autre n'est à modifier.

### a) `src/data/site.ts` : les faits

| Champ | À renseigner |
|---|---|
| `brand.name` | le nom de marque, ex. `Focuspaath` |
| `url` | `https://focuspaath.shop` (sans barre finale) |
| `coach.name`, `coach.status` | prénom et nom ; un titre **réellement détenu** (sinon vide) |
| `contact.email`, `contact.phone` | coordonnées professionnelles réelles |
| `contact.city`, `contact.area` | ville et zone du présentiel |
| `contact.modes` | `false` pour un format non proposé (l'offre et ses mentions disparaissent) |
| `social.*` | URL complètes des comptes (vide = aucun lien) |
| `booking.calendlyUrl` | lien public Calendly, ex. `https://calendly.com/…/seance` |
| `booking.ctaNote` | seulement une offre **réellement pratiquée** (sinon vide) |
| `legal.*` | raison sociale, statut, SIRET, adresse, directeur de la publication, date de mise à jour ; capital, immatriculation et TVA si concernés |

Laisse vide (`''`) tout ce que tu ne connais pas : une valeur vide ou commençant par `TODO`
n'est **jamais affichée**. Ne mets jamais un faux e-mail ou un faux numéro « pour voir ».

### b) `public/CNAME` : le domaine seul

```bash
printf '%s\n' "$DOMAINE" > public/CNAME
```

### c) `src/styles/theme.css` : la couleur d'accent

Garde le thème sombre et change seulement la famille « accent », en restant cohérent :

| Jeton | Rôle |
|---|---|
| `--c-accent` | couleur principale (boutons, liens, sur-titres) |
| `--c-accent-bright` | survol, un peu plus clair |
| `--c-accent-dim` | filets et bordures, un peu plus sombre |
| `--c-accent-soft` | même teinte en `rgba(…, 0.12)` |
| `--shadow-accent`, `--ring` | même teinte en `rgba` (ombre, anneau de focus) |
| `--grad-accent` | dégradé du titre (accent → accent 2) |

`npm run check` calcule les contrastes : l'accent doit rester lisible sur les fonds sombres
(≥ 4,5:1) et `--c-text-on-accent` lisible sur l'accent.

Les **polices** sont auto-hébergées (aucune requête vers Google). Pour garder le même design, ne
touche pas aux `@import '@fontsource-variable/…'` en tête de `theme.css`. Détail : `CONTRACT.md`.

### d) `src/data/content.ts` : reformuler les textes

Réécris les phrases avec tes mots, **même sens, mêmes sections, tutoiement**. Quatre règles
simples, contrôlées en partie par `npm run check` :

1. **Rien d'inventé.** Pas de faux témoignage, de diplôme, d'années d'expérience, de nombre
   de clients, de statistique, ni d'anecdote « je ». Ces éléments ne vont que dans les tableaux
   `testimonials`, `credentials` et `stats` en bas du fichier, **uniquement s'ils sont vrais**.
   Vides, leurs sections n'apparaissent pas.
2. **Aucune promesse non confirmée.** Pas de « séance offerte », « garanti », « satisfait ou
   remboursé », ni de délai précis. Si une offre existe vraiment, elle va dans `booking.ctaNote`.
3. **Aucune allégation médicale.** Pas de « soigner », « guérir », « traiter », « thérapie »,
   ni de kilos à perdre, de « sport sur ordonnance » ou d'« activité physique adaptée ».
   La nutrition reste des **repères généraux d'hygiène alimentaire** : jamais de régime prescrit,
   jamais le titre de diététicien. Garde les rappels « ne remplace pas un avis médical ».
4. **Jamais de texte provisoire publié.** Une information inconnue reste vide et ne s'affiche
   pas. Seules les pages légales affichent « (à compléter) » pour une mention obligatoire manquante.

Typographie : `’` et non `'`, « guillemets » et espace insécable avant `: ; ! ?`
(dans les chaînes, écris `${nb}`). Pas de prix, tarif, forfait ni CGV.

Les pages légales (`/mentions-legales`, `/confidentialite`) sont des **modèles** rédigés pour
correspondre exactement au fonctionnement du site (aucun cookie propre, aucun formulaire,
Calendly chargé après un clic, polices auto-hébergées, hébergement GitHub Pages). Relis-les pour
chaque site. Si le fonctionnement change (mesure d'audience, formulaire…), elles doivent changer aussi.

---

## 3. Installer et vérifier

```bash
npm install && npm run check
```

Le résultat doit finir sur **« Résultat : OK »**. La liste « AVERTISSEMENTS » indique ce qui reste
à renseigner. Pour voir le site en local : `npm run dev`, puis http://localhost:4321.

---

## 4. Publier sur GitHub Pages

```bash
GH_USER=$(gh api user --jq .login)     # ton identifiant GitHub

git init -b main
git add -A
git commit -m "Site $DOMAINE"

gh repo create "$NOM" --public --source=. --remote=origin --push

# Pages en mode « GitHub Actions », puis le domaine personnalisé.
# Chemins SANS barre oblique initiale : Git Bash transformerait « /repos/… » en chemin Windows.
gh api -X POST "repos/$GH_USER/$NOM/pages" -f build_type=workflow
gh api -X PUT  "repos/$GH_USER/$NOM/pages" -f cname="$DOMAINE"

# Relancer le déploiement (le premier push a pu partir avant l'activation de Pages)
gh workflow run deploy.yml
gh run watch
```

Si `POST …/pages` répond que le site existe déjà, passe directement au `PUT`. Le workflow
`.github/workflows/deploy.yml` relance `npm run check` avant chaque publication : un site non
conforme n'est jamais mis en ligne.

Une fois le DNS propagé et le certificat émis (étape 5), force le HTTPS :

```bash
gh api -X PUT "repos/$GH_USER/$NOM/pages" -F https_enforced=true
gh api "repos/$GH_USER/$NOM/pages"     # vérifier : "cname", "https_enforced", "status"
```

---

## 5. DNS chez Namecheap

**Domain List** → **Manage** en face du domaine → onglet **Advanced DNS**.

Supprime d'abord les enregistrements par défaut de Namecheap : `CNAME www → parkingpage…` et
`URL Redirect @ → http://www…`. Puis ajoute exactement ces **9 enregistrements** (TTL Automatic) :

| Type | Host | Value |
|---|---|---|
| A Record | `@` | `185.199.108.153` |
| A Record | `@` | `185.199.109.153` |
| A Record | `@` | `185.199.110.153` |
| A Record | `@` | `185.199.111.153` |
| AAAA Record | `@` | `2606:50c0:8000::153` |
| AAAA Record | `@` | `2606:50c0:8001::153` |
| AAAA Record | `@` | `2606:50c0:8002::153` |
| AAAA Record | `@` | `2606:50c0:8003::153` |
| CNAME Record | `www` | `<utilisateur>.github.io.` |

`<utilisateur>` : ton identifiant GitHub **en minuscules**, avec le **point final**.
Clique sur **Save all changes**.

Vérifier :

```bash
nslookup "$DOMAINE"          # les 4 adresses 185.199.10x.153
curl -I "https://$DOMAINE"   # HTTP/2 200
```

Délais habituels : DNS de 5 min à 2 h (48 h au pire), certificat HTTPS de 15 min à 1 h
après la vérification du domaine.

---

## 6. Checklist avant de partager le site

- [ ] **Nom du coach** et statut réellement détenu (page À propos)
- [ ] **E-mail** professionnel qui fonctionne (envoie-toi un message depuis la page Contact)
- [ ] **Téléphone** correct (le lien d'appel ouvre le bon numéro)
- [ ] **Ville** ou zone du présentiel
- [ ] **Lien Calendly** : sur /reservation, « Afficher le calendrier de réservation » charge le bon calendrier
- [ ] **Réseaux sociaux** : chaque icône mène au bon compte
- [ ] **Mentions légales** : plus aucun « (à compléter) » ; directeur de la publication renseigné
- [ ] **Confidentialité** : date de mise à jour renseignée ; texte relu
- [ ] Nom de marque, domaine et `public/CNAME` identiques ; HTTPS actif
- [ ] Aucun témoignage, diplôme ou chiffre qui ne soit pas vrai
- [ ] `npm run check` : « Résultat : OK » et plus d'avertissement bloquant

---

## Dépannage

- **404 sur le domaine** : dans **Settings → Pages**, la source doit être **GitHub Actions** ;
  le dernier run de l'onglet **Actions** doit être vert.
- **« Domain does not resolve to the GitHub Pages server »** : DNS pas encore propagé, ou
  enregistrements par défaut de Namecheap non supprimés.
- **Certificat HTTPS invalide** : normal pendant la première heure. Sinon, retire le domaine
  (`gh api -X PUT "repos/$GH_USER/$NOM/pages" -f cname=`) puis remets-le.
- **Le run échoue sur « npm run check »** : lance `npm run check` en local et corrige les ERREURS.

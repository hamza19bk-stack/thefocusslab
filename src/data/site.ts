/**
 * ============================================================================
 *  src/data/site.ts — FAITS DU SITE (fichier 1/3 à modifier pour un nouveau site)
 * ============================================================================
 *
 *  Ce fichier ne contient QUE des faits propres au propriétaire : identité,
 *  coordonnées, réseaux, réservation, navigation, SEO, mentions légales.
 *  Tous les textes rédigés des pages sont dans src/data/content.ts ;
 *  l'identité visuelle est dans src/styles/theme.css.
 *
 *  RÈGLE D'OR : une valeur vide ('') ou commençant par « TODO » n'est JAMAIS
 *  affichée (helper isSet de src/lib/utils.ts). La carte, le lien ou la ligne
 *  correspondante disparaît simplement. Ne mets jamais de faux e-mail ou de
 *  faux numéro « pour voir » : laisse la chaîne vide.
 *
 *  Exception : les pages légales affichent « (à compléter) » pour une mention
 *  obligatoire manquante, afin de ne jamais faire croire qu'elles sont complètes.
 *
 *  `npm run check` liste tout ce qui reste à renseigner avant la mise en ligne.
 *  N'oublie pas public/CNAME (le domaine seul, ex. : exemple.shop).
 */

export const site = {
  // ------------------------------------------------------------------ MARQUE
  brand: {
    name: 'TheFocussLab', // nom de la marque (ex. « Focusla »). Vide => le logo affiche ui.brandFallback.
    tagline: 'Coaching sportif, méthode et ajustements', // sur-titre court (pied de page, JSON-LD)
  },

  /** URL publique complète, sans barre oblique finale. Doit correspondre à public/CNAME. */
  url: 'https://thefocusslab.shop',

  /** Style de mise en page : 'default' ou une variante de src/styles/variants/ (lab, studio, bold). */
  design: 'lab',

  // ------------------------------------------------------------------- COACH
  coach: {
    name: '', // TODO : prénom et nom tels qu'ils doivent apparaître (page À propos)
    status: '', // TODO : ex. « Coach sportif » ou « Éducateur sportif » — uniquement un titre réellement détenu
  },

  // ----------------------------------------------------------------- CONTACT
  contact: {
    email: '', // TODO : adresse e-mail professionnelle
    phone: '', // TODO : numéro affiché, ex. « 06 12 34 56 78 » (le lien tel: est calculé)
    city: '', // TODO : ville des séances en présentiel (vide => aucune ville affichée)
    area: '', // TODO : zone couverte en présentiel, ex. « Lyon et sa métropole » (optionnel)
    responseTime: '', // TODO (optionnel) : délai de réponse RÉELLEMENT tenu, ex. « sous 48 h ouvrées »
    hours: '', // TODO (optionnel) : horaires de joignabilité, ex. « du lundi au vendredi, 9 h – 19 h »
    /** Formats réellement proposés : false => offres, puces et FAQ liées disparaissent. */
    modes: {
      inPerson: true, // séances individuelles en présentiel
      online: true, // séances individuelles en visio
      remote: true, // programmes d'entraînement à distance
    },
  },

  // ----------------------------------------------------------------- RÉSEAUX
  // URL complètes. Vide => aucun lien.
  social: {
    instagram: '', // TODO : https://instagram.com/…
    facebook: '', // TODO : https://facebook.com/…
    tiktok: '', // TODO : https://tiktok.com/@…
    youtube: '', // TODO : https://youtube.com/@…
    linkedin: '', // TODO : https://linkedin.com/in/…
    whatsapp: '', // TODO : https://wa.me/33612345678 (carte WhatsApp de la page Contact)
  },

  // ------------------------------------------------------------- RÉSERVATION
  booking: {
    /** Lien public Calendly. Vide => encart de réservation par e-mail / téléphone. */
    calendlyUrl: '', // TODO : ex. 'https://calendly.com/…/seance'
    ctaLabel: 'Réserver une séance', // libellé des boutons principaux
    ctaShortLabel: 'Réserver', // libellé court (en-tête)
    /**
     * Note affichée sous les boutons de réservation. OPTIONNELLE, vide par défaut.
     * N'y écris qu'une offre réellement pratiquée (ex. « Première séance offerte »).
     */
    ctaNote: '', // TODO (optionnel)
  },

  // -------------------------------------------------------------- NAVIGATION
  /** Les 5 pages du site, dans cet ordre (contrôlé par npm run check). */
  nav: [
    { label: 'Accueil', href: '/' },
    { label: 'À propos', href: '/a-propos' },
    { label: 'Services', href: '/services' },
    { label: 'Réservation', href: '/reservation' },
    { label: 'Contact', href: '/contact' },
  ],
  /** Pages légales : liées depuis le pied de page uniquement. */
  legalNav: [
    { label: 'Mentions légales', href: '/mentions-legales' },
    { label: 'Confidentialité', href: '/confidentialite' },
  ],

  // --------------------------------------------------------------------- SEO
  seo: {
    lang: 'fr',
    locale: 'fr_FR',
    /** Image de partage 1200×630 déposée dans public/ (ex. '/og-image.jpg'). Vide => pas de balise og:image. */
    ogImage: '', // TODO (recommandé)
    keywords: ['coach sportif', 'coaching sportif', 'programme d’entraînement personnalisé', 'coaching en visio', 'accompagnement nutritionnel'],
  },

  // ------------------------------------------------------ MENTIONS LÉGALES
  // Utilisé par /mentions-legales (art. 6 III de la LCEN) et /confidentialite (RGPD).
  // Une mention obligatoire vide s'affiche « (à compléter) » sur ces pages.
  // L'e-mail et le téléphone de l'éditeur sont ceux de contact (ci-dessus).
  legal: {
    businessName: '', // TODO : raison sociale, ou prénom et nom de l'entrepreneur individuel
    legalForm: '', // TODO : statut, ex. « Entrepreneur individuel (micro-entreprise) », « SASU »
    siret: '', // TODO : numéro SIRET (14 chiffres)
    registration: '', // TODO (sociétés, artisans) : ex. « RCS Lyon 123 456 789 » — vide si non immatriculé
    shareCapital: '', // TODO (sociétés uniquement) : ex. « 1 000 € »
    vatNumber: '', // TODO (si assujetti à la TVA) : numéro de TVA intracommunautaire
    address: '', // TODO : adresse du siège ou de domiciliation
    publicationDirector: '', // TODO : prénom et nom du directeur de la publication
    /** Date de dernière mise à jour de la politique de confidentialité. */
    lastUpdated: '', // TODO : ex. « 17 septembre 2026 »
    /** Hébergeur (GitHub Pages) — coordonnées publiques de GitHub, Inc. */
    host: {
      name: 'GitHub, Inc.',
      address: '88 Colin P Kelly Jr Street, San Francisco, CA 94107, États-Unis',
      phone: '+1 877 448 4820',
      url: 'https://github.com',
    },
  },
};

export type Site = typeof site;

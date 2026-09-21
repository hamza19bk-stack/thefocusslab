/**
 * ============================================================================
 *  src/data/content.ts — TEXTES DU SITE (fichier 2/3 à modifier pour un nouveau site)
 * ============================================================================
 *
 *  Tout le texte visible de toutes les pages est ici. Les pages .astro ne
 *  contiennent aucun texte en dur (vérifié par `npm run check`).
 *  Pour un nouveau site de la série : reformule les phrases (même sens, mêmes
 *  sections), sans jamais enfreindre les règles ci-dessous.
 *
 *  RÈGLES DE RÉDACTION (non négociables) :
 *  1. Rien d'inventé présenté comme réel : aucun témoignage, diplôme, année
 *     d'expérience, nombre de clients, statistique ni anecdote biographique
 *     qui ne soit pas un FAIT fourni par le propriétaire. Ces éléments vivent
 *     dans les tableaux `testimonials`, `credentials` et `stats` en bas de
 *     fichier : VIDES par défaut, et la section correspondante est masquée.
 *  2. Aucune promesse commerciale non confirmée (séance offerte, garantie,
 *     remboursement, délai précis) : ces éléments sont des champs optionnels
 *     de site.ts, vides par défaut.
 *  3. Aucune allégation médicale ou thérapeutique (soigner, guérir, traiter,
 *     thérapie, perte de poids chiffrée, sport sur ordonnance, APA). La
 *     nutrition se limite à des repères généraux d'hygiène alimentaire :
 *     jamais de prescription de régime, jamais le titre de diététicien.
 *  4. Périmètre : pas de prix, de tarif, de paiement en ligne ni de CGV.
 *  5. Typographie française : apostrophe ’, guillemets « » avec espaces
 *     insécables, espace insécable avant : ; ! ? — dans les chaînes JS,
 *     utilise ${nb} (U+00A0), jamais &nbsp; (non décodé dans les props).
 *  6. Tutoiement, formulations épicènes (éviter « seul », « prêt »,
 *     « motivé » accordés au masculin).
 */

import { site } from './site';
import { isSet, nb } from '../lib/utils';
import { overrides } from './overrides';

// ---------------------------------------------------------------- TYPES
export type ModeKey = 'inPerson' | 'online' | 'remote';
export type IconName = string;

export interface Card { icon: IconName; title: string; text: string; }
export interface Step { title: string; text: string; }
export interface FaqItem { q: string; a: string; requires?: ModeKey[]; }
export interface Offer {
  id: string;
  mode: ModeKey | null; // null = toujours proposé
  icon: IconName;
  short: string; // libellé court (raccourcis de la page Services)
  title: string;
  summary: string; // aperçu (accueil)
  description: string; // détail (Services)
  includes: string[];
  forWho: string;
  note?: string;
  ctaLabel: string;
  ctaTarget: 'booking' | 'contact';
}
export interface Testimonial { text: string; author: string; detail?: string; }
export interface Credential { title: string; issuer?: string; year?: string; }
export interface Stat { value: string; label: string; }
export interface LegalRow { label: string; value: string; required: boolean; }
export interface LegalSection {
  title: string;
  /** Ancre explicite (sinon calculée à partir du titre). */
  id?: string;
  paragraphs?: string[];
  rows?: LegalRow[];
  list?: string[];
  /** Liens externes (politique d'un prestataire, CNIL…). */
  links?: { label: string; href: string }[];
  /** Lien interne en fin de section. */
  link?: { before: string; label: string; href: string };
}

// ------------------------------------------------------- VALEURS DÉRIVÉES
const brand = isSet(site.brand.name) ? site.brand.name : '';
const place = isSet(site.contact.area) ? site.contact.area : isSet(site.contact.city) ? site.contact.city : '';
const m = site.contact.modes;
const hasMail = isSet(site.contact.email);
const hasTel = isSet(site.contact.phone);
const hasWa = isSet(site.social.whatsapp);
const hasCal = isSet(site.booking.calendlyUrl);
const hasSocial = ['instagram', 'facebook', 'tiktok', 'youtube', 'linkedin'].some((k) => isSet(site.social[k as keyof typeof site.social]));

/** « Séances en présentiel à Lyon, séances en visio et programmes à distance. » */
function formatsSentence(): string {
  const parts: string[] = [];
  if (m.inPerson) parts.push(place ? `séances en présentiel à ${place}` : 'séances en présentiel');
  if (m.online) parts.push('séances en visio');
  if (m.remote) parts.push('programmes à distance');
  if (parts.length === 0) return '';
  const text = parts.length === 1 ? parts[0] : `${parts.slice(0, -1).join(', ')} et ${parts[parts.length - 1]}`;
  return `${text.charAt(0).toUpperCase()}${text.slice(1)}.`;
}

// ===================================================================== UI
export const ui = {
  brandFallback: 'Coaching sportif', // affiché dans le logo tant que site.brand.name est vide
  skipLink: 'Aller au contenu principal',
  homeLink: 'retour à l’accueil',
  navLabel: 'Navigation principale',
  menuOpen: 'Ouvrir le menu',
  menuClose: 'Fermer le menu',
  footerNavLabel: 'Navigation du pied de page',
  footerNavTitle: 'Navigation',
  footerContactTitle: 'Contact',
  footerLegalLabel: 'Informations légales',
  socialLabel: 'Réseaux sociaux',
  newWindow: '(nouvelle fenêtre)',
  modesLabel: 'Formats d’accompagnement',
  rights: 'Tous droits réservés.',
  healthNotice: `Coaching sportif et conseils généraux d’hygiène de vie${nb}: ces prestations ne constituent pas un acte médical et ne remplacent pas l’avis d’un professionnel de santé. En cas de doute, demande l’avis de ton médecin avant de reprendre une activité physique.`,
  stepPrefix: (n: number) => `Étape ${n}${nb}: `,
  legalMissing: '(à compléter)',
  faqMore: `Ta question n’est pas dans la liste${nb}?`,
  faqMoreLink: 'Écris-nous',
  includesLabel: 'Ce qui est inclus',
  forWhoLabel: `Pour qui${nb}?`,
  responseTimeLabel: `Délai de réponse habituel${nb}:`,
  hoursLabel: `Horaires${nb}:`,
  updatedLabel: `Dernière mise à jour${nb}:`,
};

export const modeLabels: Record<ModeKey, string> = {
  inPerson: 'En présentiel',
  online: 'En visio',
  remote: 'Programme à distance',
};

// ================================================================= OFFRES
export const offers: Offer[] = [
  {
    id: 'presentiel',
    mode: 'inPerson',
    icon: 'dumbbell',
    short: 'Présentiel',
    title: 'Coaching individuel en présentiel',
    summary: `En tête-à-tête, de l’échauffement au retour au calme${nb}: posture corrigée en direct et intensité dosée selon ta forme du jour.`,
    description:
      'Ton coach est à tes côtés pendant toute la séance. La posture est corrigée en direct, l’intensité ajustée selon ta forme du jour, et chaque exercice est expliqué pour que tu gagnes en autonomie.',
    includes: [
      `Bilan de départ${nb}: objectifs, habitudes, niveau d’activité`,
      'Séances en salle, à domicile ou en extérieur, selon la zone couverte',
      'Correction technique, mouvement par mouvement',
      `Points d’étape réguliers${nb}: charges, répétitions, ressenti`,
    ],
    forWho:
      'Tu débutes, tu reprends après une longue pause, ou tu as besoin d’un rendez-vous fixe dans ton agenda pour garder le cap.',
    ctaLabel: 'Réserver en présentiel',
    ctaTarget: 'booking',
  },
  {
    id: 'visio',
    mode: 'online',
    icon: 'video',
    short: 'Visio',
    title: 'Coaching en visio, à distance',
    summary: `Le même accompagnement à distance${nb}: une séance guidée en direct, où que tu sois.`,
    description:
      'Caméra allumée, la séance est menée en direct depuis ton salon, ta salle ou ton lieu de déplacement. Les temps de repos sont tenus, les mouvements observés et corrigés série après série.',
    includes: [
      'Séance guidée en direct, échauffement et retour au calme compris',
      'Exercices adaptés au matériel disponible, ou sans matériel',
      'Consignes pour bien t’installer face à la caméra',
      'Points à travailler d’une séance à l’autre',
    ],
    forWho:
      'Tes horaires changent souvent, tu te déplaces ou tu habites loin, et tu veux tout de même un guidage en direct pendant la séance.',
    ctaLabel: 'Réserver en visio',
    ctaTarget: 'booking',
  },
  {
    id: 'programme',
    mode: 'remote',
    icon: 'program',
    short: 'Programme',
    title: 'Programme d’entraînement personnalisé',
    summary: `Un plan écrit pour toi${nb}: séances, séries, temps de repos et progression.`,
    description:
      'Un programme construit à partir de ton objectif, de ton niveau et du matériel dont tu disposes. Chaque séance est détaillée pour que tu saches exactement quoi faire, et le plan évolue à chaque fin de cycle.',
    includes: [
      `Entretien de cadrage${nb}: objectif, contraintes, matériel`,
      'Plan structuré en cycles, avec une progression prévue',
      'Exercices de remplacement si un équipement manque',
      'Révision du plan en fin de cycle, d’après tes retours',
    ],
    forWho:
      'Tu t’entraînes déjà en autonomie, mais il te manque un plan construit et une progression organisée.',
    ctaLabel: 'Demander un programme',
    ctaTarget: 'booking',
  },
  {
    id: 'nutrition',
    mode: null,
    icon: 'drop',
    short: 'Nutrition',
    title: 'Accompagnement nutritionnel',
    summary: `Des repères simples d’hygiène alimentaire pour soutenir ton entraînement${nb}: pas de régime, pas d’aliment interdit.`,
    description:
      'Pas de régime, pas d’aliment interdit, pas de pesée à chaque repas. On part de ce que tu manges déjà et on pose des repères généraux d’hygiène alimentaire pour accompagner ton entraînement, avec des habitudes tenables même les semaines chargées.',
    includes: [
      'Point sur tes habitudes actuelles, sans jugement',
      'Repères simples pour composer tes repas au quotidien',
      'Organisation des repas autour des séances et des jours de repos',
      'Idées de repas rapides et de courses réalistes',
    ],
    forWho:
      'Tu t’entraînes régulièrement et tu veux que ton alimentation suive, ou tu cherches des repères simples plutôt qu’une succession de régimes.',
    note: `Conseils généraux d’hygiène alimentaire${nb}: ils ne constituent ni une prescription de régime ni un suivi médical, et ne remplacent pas un médecin ou un diététicien-nutritionniste.`,
    ctaLabel: 'En parler avant de commencer',
    ctaTarget: 'contact',
  },
];

// ================================================================ ACCUEIL
export const home = {
  seo: {
    title: place ? `Coach sportif à ${place}${nb}: séances et programmes sur mesure` : `Coach sportif${nb}: séances et programmes sur mesure`,
    description: `Coaching sportif personnalisé${nb}: séances individuelles en présentiel ou en visio, programme d’entraînement sur mesure et accompagnement nutritionnel.`,
  },
  hero: {
    eyebrow: 'Coaching sportif personnalisé',
    titleLead: 'Coaching sportif sur mesure,',
    titleMark: 'à ton rythme',
    lead: `Un entraînement construit autour de ta vie réelle${nb}: ton niveau, ton emploi du temps, ton objectif. Pas de programme copié-collé, pas de promesse en l’air${nb}— un cadre clair, des séances utiles et un suivi régulier.`,
    secondaryCta: 'Découvrir les services',
    visualLabel: 'Semaine après semaine',
  },
  highlights: {
    eyebrow: 'L’approche',
    title: 'Un cadre, pas des recettes',
    subtitle: `Quatre principes guident chaque séance et chaque programme${nb}: ils expliquent pourquoi l’entraînement tient dans la durée.`,
    items: [
      { icon: 'clipboard', title: `Un bilan avant tout programme`, text: 'Habitudes, niveau d’activité, objectifs, contraintes de la semaine. On part de ta situation réelle, pas d’un modèle standard.' },
      { icon: 'shield', title: `La technique avant la charge`, text: 'Chaque mouvement est expliqué, corrigé et maîtrisé avant d’augmenter l’intensité. Progresser proprement, c’est progresser durablement.' },
      { icon: 'refresh', title: 'Un suivi régulier', text: 'Le programme est relu et ajusté au fil des semaines, d’après tes retours. Tu n’avances jamais à l’aveugle.' },
      { icon: 'clock', title: `Des séances qui s’intègrent à ta semaine`, text: 'Durée, format et horaires s’adaptent à ton quotidien. Un entraînement que l’on peut tenir vaut mieux qu’un entraînement parfait abandonné.' },
    ] as Card[],
  },
  stats: {
    eyebrow: 'Quelques repères',
    title: 'En chiffres',
  },
  offers: {
    eyebrow: 'Les services',
    title: 'Trouve le format qui te correspond',
    subtitle: formatsSentence(),
    moreLabel: 'Voir tous les services',
    cardCta: 'En savoir plus',
    cardCtaAria: (title: string) => `En savoir plus${nb}: ${title}`,
  },
  method: {
    eyebrow: 'La méthode',
    title: 'Quatre étapes, aucune improvisation',
    subtitle: `Le chemin est le même pour tout le monde${nb}; son contenu change, parce qu’il est construit pour toi.`,
    steps: [
      { title: 'Le bilan', text: `On prend le temps de tout poser${nb}: objectif, habitudes sportives, rythme de vie, sommeil, créneaux disponibles. Rien ne commence avant que ce soit clair.` },
      { title: 'Le programme sur mesure', text: `Tu repars avec un plan clair${nb}: séances, ordre des exercices, repères d’intensité et de récupération.` },
      { title: 'L’entraînement et le suivi', text: 'On exécute, on corrige, on ajuste. L’intensité augmente quand la technique suit, et le plan évolue avec ta forme et tes imprévus.' },
      { title: 'Des repères mesurés', text: `On compare régulièrement avec le point de départ${nb}: force, endurance, mobilité, aisance au quotidien. L’évolution se constate${nb}— elle ne se devine pas.` },
    ] as Step[],
  },
  testimonials: {
    eyebrow: 'Témoignages',
    title: 'Retours de personnes accompagnées',
    subtitle: 'Témoignages publiés avec l’accord de leurs auteurs.',
  },
  cta: {
    eyebrow: 'Premier pas',
    title: `On commence quand${nb}?`,
    lead: 'Une première séance pour faire le point, fixer un objectif réaliste et repartir avec une direction claire.',
    secondaryCta: 'Poser une question',
  },
};

// =============================================================== À PROPOS
export const about = {
  seo: {
    title: 'À propos',
    description: `Découvre l’approche du coaching${nb}: une méthode progressive, expliquée et suivie dans le temps, pour gagner en forme, en énergie et en régularité.`,
  },
  hero: {
    eyebrow: 'À propos',
    titleLead: 'Un coaching',
    titleMark: 'centré sur la personne',
    lead: `Pas de méthode miracle, pas de discours recopié${nb}: le coaching commence par comprendre ton quotidien, tes contraintes et ton rapport au sport. Ensuite seulement, on construit un entraînement qui tient dans la durée.`,
    secondaryCta: 'Voir les services',
  },
  approach: {
    eyebrow: 'L’approche',
    title: 'Quatre convictions de travail',
    subtitle: 'Elles orientent chaque séance, du premier échange au suivi dans la durée.',
    steps: [
      { title: 'Partir du réel', text: `Chaque accompagnement démarre par ta situation concrète${nb}: niveau, emploi du temps, envies, contraintes. Un programme qui ignore la vie quotidienne ne tient pas.` },
      { title: 'Comprendre plutôt que copier', text: 'Chaque exercice a une raison d’être. Savoir ce qu’il travaille et pourquoi il est placé là aide à le réaliser correctement et à garder la motivation.' },
      { title: 'Ajuster en continu', text: 'Un même exercice ne produit pas le même effet selon la personne, l’emploi du temps ou le niveau d’énergie. Le plan s’adapte donc au fil des semaines.' },
      { title: 'Viser l’autonomie', text: 'L’objectif n’est pas de créer une dépendance au coach, mais de te rendre capable de t’entraîner avec méthode et en sécurité.' },
    ] as Step[],
  },
  philosophy: {
    eyebrow: 'La philosophie',
    title: 'Exigeant sur la méthode, patient avec les personnes',
    subtitle: 'Trois principes guident chaque séance, du premier bilan au suivi dans la durée.',
    items: [
      { icon: 'trend', title: 'Progressif avant d’être intense', text: `Une bonne séance n’est pas celle qui t’épuise, c’est celle que tu peux répéter la semaine suivante. La technique et la régularité d’abord${nb}; l’intensité vient ensuite.` },
      { icon: 'compass', title: 'Clair à chaque étape', text: 'Tu sais où tu vas, à quel rythme et pourquoi. Si un objectif paraît irréaliste ou inadapté, on te le dit franchement.' },
      { icon: 'heart', title: 'Durable plutôt que spectaculaire', text: 'Les transformations express se défont souvent aussi vite qu’elles arrivent. L’accompagnement privilégie des habitudes qui résistent aux semaines chargées et aux coups de fatigue.' },
    ] as Card[],
    commitmentsTitle: 'Ce que tu trouveras ici',
    commitments: [
      'Un premier bilan honnête, sans jugement sur ton niveau ni sur ton passé sportif.',
      'Un programme pensé pour ton emploi du temps réel.',
      'Des explications sur chaque exercice.',
      'Des ajustements réguliers plutôt qu’un programme figé.',
    ],
    notHereTitle: 'Ce que tu ne trouveras pas ici',
    notHere: [
      'Des promesses de résultats en un temps record.',
      `Des régimes restrictifs ou des compléments présentés comme «${nb}indispensables${nb}».`,
      `De la culpabilisation${nb}: une semaine difficile n’efface pas les précédentes.`,
      `Des conseils médicaux${nb}: pour toute question de santé, ton médecin reste l’interlocuteur de référence.`,
    ],
    quote: `«${nb}Le meilleur entraînement n’est pas le plus dur${nb}: c’est celui que l’on peut encore suivre dans six mois.${nb}»`,
  },
  credentials: {
    eyebrow: 'Formations',
    title: 'Diplômes et formations',
    subtitle: 'Qualifications détenues par le coach.',
  },
  values: {
    eyebrow: 'Les valeurs',
    title: 'Ce qui ne change pas, quel que soit ton objectif',
    subtitle: 'Quatre repères valables dès la première séance et tout au long de l’accompagnement.',
    items: [
      { icon: 'message', title: 'Écoute', text: 'La première séance sert surtout à poser des questions. Tes habitudes, ton rythme de vie et tes envies comptent autant que ton objectif.' },
      { icon: 'gauge', title: 'Exigence bienveillante', text: 'De la régularité plutôt que de la perfection. La technique reste précise, sans jamais dramatiser une séance manquée.' },
      { icon: 'eye', title: 'Transparence', text: 'Le contenu des séances, le rythme proposé et les modalités pratiques sont expliqués clairement dès le départ.' },
      { icon: 'calendar-check', title: 'Régularité', text: 'Des séances tenues chaque semaine valent mieux qu’une semaine intense suivie d’un long arrêt. Tout le reste en découle.' },
    ] as Card[],
  },
  formats: {
    eyebrow: 'Travailler ensemble',
    title: 'Plusieurs formats d’accompagnement',
    subtitle: `Le format change${nb}; la méthode et l’attention portée à chaque séance restent les mêmes.`,
    moreLabel: 'Le détail des services',
    texts: {
      inPerson: `Des séances individuelles en personne, en salle, à domicile ou en extérieur${nb}: la posture est corrigée en direct et l’intensité ajustée au fil de la séance.`,
      online: `Le même accompagnement en visio${nb}: séance guidée en direct, corrections en temps réel et peu de matériel nécessaire.`,
      remote: 'Un programme écrit pour toi, revu à chaque fin de cycle, avec des consignes détaillées pour chaque exercice.',
    } as Record<ModeKey, string>,
    icons: { inPerson: 'pin', online: 'video', remote: 'mobile' } as Record<ModeKey, IconName>,
    note: place && m.inPerson && (m.online || m.remote)
      ? `Séances en présentiel à ${place}${nb}; partout ailleurs, en visio ou avec un programme à distance.`
      : '',
  },
  cta: {
    eyebrow: 'La suite',
    title: `On en parle${nb}?`,
    lead: `Le plus simple est d’échanger${nb}: où tu en es, ce que tu as déjà essayé et ce que tu aimerais changer.`,
    secondaryCta: 'Poser une question',
  },
};

// =============================================================== SERVICES
export const services = {
  seo: {
    title: `Services${nb}: coaching individuel, programmes et nutrition`,
    description: `Coaching individuel en présentiel ou en visio, programme d’entraînement personnalisé et accompagnement nutritionnel${nb}: découvre les formats de coaching.`,
  },
  hero: {
    eyebrow: 'Les services',
    titleLead: 'Plusieurs façons',
    titleMark: 'de progresser',
    lead: `Le format change, l’exigence reste la même${nb}: chaque accompagnement démarre par un bilan, se construit autour de tes contraintes réelles et s’ajuste au fil des semaines.`,
    secondaryCta: 'Poser une question',
    jumpLabel: 'Aller à un service',
  },
  offers: {
    eyebrow: 'Le détail',
    title: 'Choisis ton format',
    subtitle: formatsSentence(),
  },
  common: {
    eyebrow: 'Quel que soit le format',
    title: 'Ce qui ne change jamais',
    subtitle: `Quatre repères communs à chaque accompagnement${nb}: ce sont eux qui font tenir un programme au-delà des premières semaines.`,
    items: [
      { icon: 'check-doc', title: 'Un bilan avant tout', text: 'Aucune séance ne démarre sans avoir posé ton point de départ, tes contraintes et un objectif que l’on sait suivre.' },
      { icon: 'cycle', title: 'Un plan qui évolue', text: 'Le programme est revu régulièrement, d’après tes retours et tes repères de progression. Rien n’est figé.' },
      { icon: 'chat', title: 'Un échange direct', text: `Une question sur un exercice ou sur l’organisation${nb}? Tu échanges directement avec ton coach.` },
      { icon: 'bars', title: 'Des repères concrets', text: `Répétitions, charges, souffle, ressenti${nb}: on suit des indicateurs concrets, pas uniquement le chiffre de la balance.` },
    ] as Card[],
  },
  process: {
    eyebrow: 'Comment ça se passe',
    title: 'Du premier message à la première séance',
    subtitle: `Aucune étape surprise${nb}: tu sais dès le départ comment se déroule l’accompagnement.`,
    steps: [
      { title: 'Le premier échange', text: 'Tu réserves une séance ou tu nous écris. On parle de ton objectif, de ton emploi du temps et de ce que tu as déjà essayé.' },
      { title: 'Le bilan', text: 'Habitudes, niveau de départ, matériel et lieu d’entraînement, points de vigilance éventuels. Un objectif réaliste est fixé ensemble, avec la façon de suivre son évolution.' },
      { title: 'Le plan', text: `L’accompagnement se construit${nb}: format, fréquence réaliste, contenu des séances, enchaînement des cycles. Chaque choix t’est expliqué.` },
      { title: 'L’entraînement et les points d’étape', text: `Les séances s’enchaînent, avec corrections et ajustements. En fin de cycle, on compare avec le point de départ${nb}: on garde ce qui fonctionne, on change le reste.` },
    ] as Step[],
  },
  faq: {
    eyebrow: 'Questions fréquentes',
    title: 'Les questions les plus courantes',
    subtitle: 'Les réponses aux hésitations les plus fréquentes avant de se lancer.',
    items: [
      { q: `Faut-il déjà être sportif ou sportive pour commencer${nb}?`, a: 'Non. Le bilan sert précisément à partir de ton niveau réel plutôt que d’un niveau supposé. Les premières séances restent volontairement progressives.' },
      { q: `Comment se passe la première séance${nb}?`, a: `Elle commence par un échange${nb}: habitudes sportives, rythme de vie, objectifs, contraintes. Viennent ensuite quelques mouvements simples pour observer la mobilité, l’équilibre et la coordination. Tu repars avec une direction claire et un objectif réaliste.` },
      {
        q: `Où se déroulent les séances en présentiel${nb}?`,
        a: place
          ? `À ${place}${nb}: en salle, à domicile lorsque l’espace le permet, ou en extérieur. Le lieu est choisi ensemble lors du bilan.`
          : 'En salle, à domicile lorsque l’espace le permet, ou en extérieur. Le lieu et la zone couverte sont précisés lors du premier échange.',
        requires: ['inPerson'],
      },
      { q: `Combien de séances par semaine prévoir${nb}?`, a: `Cela dépend de ton objectif et de ton emploi du temps. Mieux vaut deux séances réellement faites que cinq prévues et abandonnées${nb}: la fréquence se décide ensemble, lors du bilan.` },
      { q: `Faut-il du matériel à la maison${nb}?`, a: `Pas nécessairement. Un espace dégagé suffit pour commencer${nb}: le poids du corps offre déjà de nombreuses variations, et le programme s’adapte au matériel dont tu disposes.` },
      { q: `L’accompagnement nutritionnel, c’est un régime${nb}?`, a: `Non. Aucun aliment interdit, aucune pesée obligatoire${nb}: on travaille des repères généraux d’hygiène alimentaire (composition des repas, régularité, hydratation, organisation autour des séances). Ce ne sont ni une prescription ni un suivi médical${nb}: en cas de pathologie, de trouble alimentaire ou de besoin spécifique, un médecin ou un diététicien-nutritionniste reste l’interlocuteur adapté.` },
      { q: `Le coaching remplace-t-il un suivi médical${nb}?`, a: 'Non. Ces prestations ne constituent pas un acte médical et ne remplacent pas l’avis d’un professionnel de santé. En cas de pathologie, de blessure ou de traitement en cours, demande l’avis de ton médecin avant de commencer.' },
    ] as FaqItem[],
  },
  cta: {
    eyebrow: 'Passer à l’action',
    title: `Une question avant de te lancer${nb}?`,
    lead: 'Le plus simple reste d’en parler. Une première séance permet de faire le point, de fixer un objectif réaliste et de choisir le format qui te correspond.',
    secondaryCta: 'Poser une question',
  },
};

// ============================================================ RÉSERVATION
const bookingEmailLines = [
  'Bonjour,',
  '',
  'Je souhaite réserver une séance.',
  '',
  `- Prénom${nb}:`,
  `- Objectif principal${nb}:`,
  `- Format souhaité${nb}:`,
  `- Disponibilités (2 ou 3 créneaux)${nb}:`,
  '',
  'Merci,',
];

export const booking = {
  seo: {
    title: `Réservation${nb}: réserver une séance de coaching`,
    description: `Réserve ta séance de coaching sportif${nb}: bilan, objectifs et plan de départ, selon le format qui te convient.`,
  },
  hero: {
    eyebrow: 'Réservation',
    titleLead: 'Ta première séance',
    titleMark: 'commence ici',
    lead: `Une séance pour poser ton objectif, comprendre ton quotidien et repartir avec une direction claire. Pas de test d’entrée, pas de discours commercial${nb}— un bilan honnête et un plan de départ réaliste.`,
    ctaCalendly: 'Choisir un créneau',
    ctaFallback: 'Demander un créneau',
    secondaryCta: 'Voir les services',
  },
  recap: {
    eyebrow: 'En résumé',
    title: 'La première séance',
    items: [
      'Un échange sur tes objectifs et ton quotidien',
      'Quelques mouvements simples pour situer ton point de départ',
      'Une tenue confortable suffit, aucun matériel spécifique',
      'Des repères concrets pour la suite',
    ],
    noSlot: `Aucun créneau ne te convient${nb}?`,
    noSlotLink: 'Écris-nous',
  },
  after: {
    eyebrow: 'Ce qui se passe ensuite',
    title: 'De la réservation à ton plan',
    subtitle: `Quatre étapes, aucune zone d’ombre${nb}: tu sais dès maintenant à quoi ressemble la suite.`,
    steps: [
      { title: 'La confirmation', text: 'Ton rendez-vous est confirmé par écrit, avec la date, le format retenu et le lieu ou le lien de visio.' },
      { title: 'Quelques questions avant', text: `Avant la séance, quelques questions simples${nb}: objectif, niveau d’activité actuel, contraintes d’emploi du temps.` },
      { title: 'La séance de bilan', text: `On fait le point ensemble${nb}: ce que tu veux atteindre, ce que ton quotidien permet, quelques mouvements simples et des repères de départ.` },
      { title: 'Ton plan de départ', text: 'Tu repars avec des priorités concrètes et une proposition d’accompagnement adaptée. Tu décides ensuite, à ton rythme.' },
    ] as Step[],
  },
  prepare: {
    eyebrow: 'Avant le rendez-vous',
    title: 'Ce qu’il faut prévoir',
    subtitle: `Rien de compliqué${nb}: quelques minutes de préparation, et la séance va droit à l’essentiel.`,
    items: [
      { icon: 'shirt', title: 'Une tenue confortable', text: `Vêtements souples et chaussures de sport, même pour un premier bilan${nb}: quelques mouvements simples permettent de situer ton point de départ.` },
      { icon: 'drop', title: 'De l’eau et de quoi noter', text: `Une gourde et de quoi prendre des notes${nb}— papier ou téléphone. Tu repars avec des repères précis, autant les garder.` },
    ] as Card[],
    onlineItem: { icon: 'video', title: `En visio${nb}: un espace dégagé`, text: 'Une connexion stable, un téléphone ou un ordinateur posé en hauteur et un espace libre devant toi. Le lien de connexion t’est transmis avec la confirmation.' } as Card,
    checklistTitle: 'À avoir en tête',
    checklist: [
      'Ton objectif, formulé en une phrase',
      'Toute information utile à ta sécurité (gêne, blessure récente)',
      `Une semaine type${nb}: horaires, déplacements, sommeil`,
      'Le rythme que tu peux réellement tenir',
      `Ce que tu as déjà essayé${nb}— et pourquoi cela s’est arrêté`,
    ],
    goodToKnowEyebrow: 'Bon à savoir',
    goodToKnow: `Prévois quelques minutes d’avance pour démarrer à l’heure et évite un repas copieux juste avant. En cas de pathologie, de blessure ou de traitement en cours, demande l’avis de ton médecin avant de reprendre${nb}: le coaching ne remplace pas un suivi médical.`,
  },
  module: {
    eyebrow: 'Choisis ton moment',
    calendlyTitle: 'Les créneaux disponibles',
    calendlySubtitle: `Sélectionne le jour et l’heure qui te conviennent${nb}: la confirmation t’est envoyée par e-mail.`,
    /* Consentement Calendly : le module tiers n'est chargé qu'après le clic. */
    consentTitle: 'Calendrier de réservation',
    consentText: 'Le calendrier est fourni par Calendly, un service tiers qui peut déposer des cookies et recevoir ton adresse IP. Il ne se charge que si tu le demandes.',
    consentLinkBefore: 'En savoir plus dans la',
    consentLink: 'politique de confidentialité',
    loadCta: 'Afficher le calendrier de réservation',
    openCta: 'Ouvrir Calendly dans un nouvel onglet',
    loading: 'Chargement du calendrier…',
    loadError: 'Le calendrier n’a pas pu être chargé. Utilise le lien pour ouvrir Calendly dans un nouvel onglet.',
    widgetLabel: 'Calendrier de réservation Calendly',
    fallbackTitle: 'Réserver ta séance',
    fallbackSubtitle: `Pour réserver, contacte-nous directement${nb}: indique ton objectif, le format souhaité et deux ou trois créneaux qui te conviennent.`,
    fallbackCardTitle: 'Réservation par message',
    fallbackCardText: 'Nous revenons vers toi pour confirmer le rendez-vous et ses modalités.',
    emailCta: 'Réserver par e-mail',
    phoneCta: 'Appeler',
    whatsappCta: 'WhatsApp',
    emailLabel: 'E-mail',
    phoneLabel: 'Téléphone',
    closedTitle: 'Réserver ta séance',
    closedSubtitle: 'La réservation en ligne n’est pas encore ouverte sur ce site.',
    emailSubject: brand ? `Demande de séance — ${brand}` : 'Demande de séance',
    emailBody: bookingEmailLines.join('\n'),
  },
  faq: {
    eyebrow: 'Questions fréquentes',
    title: 'Avant de réserver',
    subtitle: `Report, format, niveau${nb}: les réponses aux questions qui reviennent le plus souvent.`,
    items: [
      {
        q: `Comment annuler ou reporter une séance${nb}?`,
        a: 'Préviens-nous dès que possible, par le moyen que tu as utilisé pour réserver. Les modalités d’annulation et de report sont convenues ensemble avant la première séance.',
      },
      {
        q: `Présentiel ou visio${nb}: lequel choisir${nb}?`,
        a: `Pour un premier bilan, la visio convient très bien${nb}: il s’agit surtout d’échanger et d’observer quelques mouvements simples. Le présentiel prend tout son sens ensuite, pour travailler la technique en détail. Le format peut évoluer au fil de l’accompagnement.`,
        requires: ['inPerson', 'online'],
      },
      { q: `Je débute ou je reprends après une longue pause${nb}: est-ce adapté${nb}?`, a: `Oui, c’est même le bon moment pour en parler. Le bilan sert à adapter le point de départ à ton niveau. En cas de pathologie, de blessure ou de traitement en cours, demande d’abord l’avis de ton médecin${nb}: le coaching ne remplace pas un suivi médical.` },
      ...(hasCal
        ? [{ q: `Pourquoi le calendrier ne s’affiche-t-il pas tout de suite${nb}?`, a: `Le calendrier est fourni par Calendly, un service tiers qui peut déposer des cookies. Il n’est donc chargé qu’après ton clic sur «${nb}Afficher le calendrier de réservation${nb}». Tu peux aussi réserver par message, depuis la page Contact.` }]
        : []),
    ] as FaqItem[],
  },
  cta: {
    eyebrow: 'Dernier détail',
    title: 'Le plus simple, c’est d’essayer',
    lead: 'Une séance pour savoir où tu en es et par quoi commencer. Tu repars avec des repères clairs pour la suite.',
    secondaryCta: 'Poser une question',
  },
};

// ================================================================ CONTACT
const contactEmailLines = [
  'Bonjour,',
  '',
  `- Prénom${nb}:`,
  `- Mon objectif en une phrase${nb}:`,
  `- Format envisagé${nb}:`,
  `- Mes disponibilités habituelles${nb}:`,
  '',
  `Ma question${nb}:`,
  '',
  'Merci,',
];

const enabledModeLabels = (Object.keys(modeLabels) as ModeKey[]).filter((k) => m[k]).map((k) => modeLabels[k].toLowerCase());

export const contact = {
  seo: {
    title: 'Contact',
    description: `Une question sur le coaching sportif${nb}? Écris, appelle ou réserve directement ta séance.`,
  },
  hero: {
    eyebrow: 'Contact',
    titleLead: `Une question${nb}?`,
    titleMark: 'Parlons-en',
    lead: `Pas de formulaire anonyme${nb}: tu écris ou tu appelles, et ton coach te répond. Dis simplement où tu en es et ce que tu souhaites atteindre${nb}— on verra ensemble si l’accompagnement te correspond.`,
    emailCta: 'Écrire un e-mail',
    phoneCta: 'Appeler',
  },
  tips: {
    eyebrow: 'Pour un premier message',
    title: 'Un message utile en quatre points',
    items: [
      'Ton objectif, même formulé simplement',
      'Ton niveau d’activité actuel',
      enabledModeLabels.length > 1 ? `Le format envisagé (${enabledModeLabels.join(', ')})` : 'Le format envisagé',
      'Tes créneaux réalistes dans une semaine type',
    ],
  },
  channels: {
    eyebrow: 'Moyens de contact',
    title: 'Choisis ton canal',
    subtitle: `Des moyens directs, tous cliquables${nb}: le plus simple reste celui que tu utilises déjà.`,
    email: { title: 'E-mail', text: 'Le canal le plus complet pour détailler ton objectif, tes contraintes et tes disponibilités. Le message s’ouvre déjà pré-rempli.', action: 'Ouvrir ma messagerie' },
    phone: { title: 'Téléphone', text: 'Pour une question rapide sur un format, un horaire ou l’organisation des séances.', action: 'Appeler' },
    whatsapp: { title: 'WhatsApp', value: 'Message direct', text: 'Pratique pour une question courte ou pour montrer l’espace dont tu disposes pour tes séances.', action: 'Ouvrir la discussion' },
    booking: { title: 'Réserver directement', text: `Tu sais déjà ce que tu veux${nb}? Passe directement à la réservation de ta séance.`, action: 'Voir la réservation' },
    emailSubject: brand ? `Question — ${brand}` : 'Question sur le coaching',
    emailBody: contactEmailLines.join('\n'),
  },
  exchange: {
    eyebrow: 'Parti pris',
    title: 'Pourquoi il n’y a pas de formulaire',
    text: 'Un message envoyé depuis ta messagerie ou ton téléphone te laisse une trace de l’échange, et tu sais exactement à qui tu t’adresses.',
    privacy: 'Tes coordonnées servent uniquement à te répondre. Elles ne sont ni revendues ni utilisées pour une lettre d’information.',
    practicalEyebrow: 'En pratique',
    practicalTitle: 'Quand nous joindre',
  },
  zone: {
    eyebrow: 'Zone d’intervention',
    title: place || (m.inPerson ? 'Près de chez toi ou à distance' : 'Où que tu sois'),
    subtitle: 'Plusieurs façons de travailler ensemble, selon ta situation géographique et ton emploi du temps.',
    text: m.inPerson
      ? `${place
          ? `Les séances en présentiel ont lieu à ${place}${nb}: à domicile, en extérieur ou en salle, selon ton objectif et le matériel nécessaire.`
          : 'Les séances en présentiel ont lieu à domicile, en extérieur ou en salle, selon ton objectif et le matériel nécessaire. La zone couverte est précisée lors du premier échange.'}${m.online || m.remote ? ' Ailleurs, la visio et les programmes à distance prennent le relais.' : ''}`
      : 'Les séances en visio et les programmes à distance sont accessibles où que tu sois.',
    items: {
      inPerson: `À domicile, en extérieur ou en salle${nb}: le lieu est choisi avec toi lors du bilan, selon le matériel nécessaire.`,
      online: 'Une connexion stable et un espace dégagé suffisent. Un format pratique pour les semaines chargées et les déplacements.',
      remote: 'Où que tu sois, un programme écrit et des points de suivi réguliers sur tes retours.',
    } as Record<ModeKey, string>,
  },
  social: {
    eyebrow: 'Ailleurs sur le web',
    title: 'Suivre l’actualité',
    subtitle: 'Retrouve les publications sur les réseaux sociaux.',
    text: 'Compte officiel',
  },
  cta: {
    eyebrow: 'Passer à l’action',
    title: 'Une question se règle vite, un objectif se travaille',
    lead: `Si ta question tient en une ligne, écris-nous. S’il s’agit d’un vrai projet, réserve plutôt une première séance${nb}: c’est le meilleur moyen de savoir par où commencer.`,
    secondaryCta: 'Voir les services',
  },
};

// ==================================================================== 404
export const notFound = {
  seo: { title: 'Page introuvable', description: 'La page demandée n’existe pas ou a été déplacée.' },
  eyebrow: 'Erreur 404',
  titleLead: 'Page',
  titleMark: 'introuvable',
  lead: 'La page demandée n’existe pas ou a été déplacée.',
  cta: 'Retour à l’accueil',
};

// ========================================================== PAGES LÉGALES
// Modèles à relire par le propriétaire : ils décrivent exactement ce que fait
// le site (aucun cookie propre, aucun formulaire, Calendly chargé après clic,
// polices auto-hébergées, hébergement GitHub Pages). Si le fonctionnement du
// site change (outil de mesure d'audience, formulaire…), ces textes doivent changer.
const L = site.legal;
const miss = ui.legalMissing;
const val = (v: string) => (isSet(v) ? v : miss);
const editorName = isSet(L.businessName) ? L.businessName : 'l’éditeur du site';
const channelList = [hasMail ? 'par e-mail' : '', hasTel ? 'par téléphone' : '', hasWa ? 'par WhatsApp' : ''].filter(Boolean);
const channelsText = channelList.length > 1 ? `${channelList.slice(0, -1).join(', ')} ou ${channelList[channelList.length - 1]}` : channelList.join('');

export const legal = {
  mentions: {
    seo: { title: 'Mentions légales', description: `Mentions légales du site${nb}: éditeur, directeur de la publication, hébergeur et propriété intellectuelle.` },
    title: 'Mentions légales',
    intro: `Conformément à l’article 6 III de la loi n°${nb}2004-575 du 21 juin 2004 pour la confiance dans l’économie numérique (LCEN), voici les informations relatives à l’éditeur et à l’hébergeur de ce site.`,
    sections: [
      { title: 'Éditeur du site', rows: [
        { label: 'Nom ou raison sociale', value: L.businessName, required: true },
        { label: 'Statut juridique', value: L.legalForm, required: true },
        { label: 'Capital social', value: L.shareCapital, required: false },
        { label: 'Immatriculation', value: L.registration, required: false },
        { label: 'SIRET', value: L.siret, required: true },
        { label: 'N° de TVA intracommunautaire', value: L.vatNumber, required: false },
        { label: 'Adresse', value: L.address, required: true },
        { label: 'E-mail', value: site.contact.email, required: true },
        { label: 'Téléphone', value: site.contact.phone, required: true },
      ] },
      { title: 'Directeur de la publication', rows: [
        { label: 'Nom', value: L.publicationDirector, required: true },
      ] },
      { title: 'Hébergeur', rows: [
        { label: 'Raison sociale', value: L.host.name, required: true },
        { label: 'Adresse', value: L.host.address, required: true },
        { label: 'Téléphone', value: L.host.phone, required: true },
        { label: 'Site web', value: L.host.url, required: true },
      ] },
      { title: 'Activité', paragraphs: [
        `Coaching sportif personnalisé${nb}: séances individuelles en présentiel ou en visio, programmes d’entraînement personnalisés et conseils généraux d’hygiène alimentaire en lien avec l’entraînement.`,
        'Ces prestations ne constituent pas un acte médical, ne comportent aucune prescription de régime et ne remplacent pas l’avis d’un professionnel de santé.',
      ] },
      { title: 'Propriété intellectuelle', paragraphs: [
        `L’ensemble des contenus de ce site (textes, éléments graphiques, logo) est la propriété de ${editorName}, sauf mention contraire, et est protégé par le droit de la propriété intellectuelle. Toute reproduction ou représentation, totale ou partielle, sans autorisation préalable écrite est interdite.`,
        'Les polices de caractères utilisées sont distribuées sous licence libre SIL Open Font License et hébergées avec le site.',
      ] },
      { title: 'Données personnelles et cookies', paragraphs: [
        'Ce site ne dépose aucun cookie et ne comporte aucun formulaire.',
      ], link: { before: 'Le traitement des données personnelles est décrit dans la', label: 'politique de confidentialité', href: '/confidentialite' } },
    ] as LegalSection[],
  },

  privacy: {
    seo: { title: 'Politique de confidentialité', description: `Politique de confidentialité${nb}: données traitées, finalités, durées de conservation, cookies et exercice de tes droits.` },
    title: 'Politique de confidentialité',
    intro: 'Cette page explique quelles données personnelles sont traitées lorsque tu consultes ce site ou que tu nous contactes, pourquoi, pendant combien de temps, et comment exercer tes droits.',
    updated: val(L.lastUpdated),
    sections: [
      { title: 'Responsable du traitement', rows: [
        { label: 'Nom ou raison sociale', value: L.businessName, required: true },
        { label: 'Adresse', value: L.address, required: true },
        { label: 'E-mail', value: site.contact.email, required: true },
      ] },
      { title: 'En bref', list: [
        'Ce site ne dépose aucun cookie et n’utilise aucun outil de mesure d’audience ni de publicité.',
        `Il ne comporte aucun formulaire${nb}: nous ne recevons que les informations que tu choisis de nous transmettre.`,
        `Les polices de caractères sont hébergées avec le site${nb}: aucune requête n’est envoyée à un service de polices tiers.`,
        ...(hasCal ? ['Le calendrier de réservation Calendly n’est chargé qu’après ton clic sur la page Réservation.'] : []),
        ...(hasSocial ? [`Les liens vers les réseaux sociaux sont de simples liens${nb}: aucun bouton ni contenu de ces réseaux n’est intégré aux pages.`] : []),
      ] },
      { title: 'Consultation du site et hébergement', id: 'hebergement', paragraphs: [
        `Le site est hébergé par ${L.host.name} (service GitHub Pages). Lors de chaque visite, l’hébergeur traite des données techniques de connexion${nb}: adresse IP, date et heure, page demandée, type de navigateur. Ces journaux servent à fournir le site et à en assurer la sécurité.`,
        `Base légale${nb}: intérêt légitime (fonctionnement et sécurité du site). Ces journaux sont gérés par l’hébergeur selon sa propre politique de confidentialité${nb}; l’éditeur du site n’y a pas accès.`,
      ], links: [
        { label: 'Déclaration de confidentialité de GitHub', href: 'https://docs.github.com/fr/site-policy/privacy-policies/github-general-privacy-statement' },
      ] },
      { title: 'Messages que tu nous envoies', id: 'messages', paragraphs: [
        `Lorsque tu nous contactes${channelsText ? ` (${channelsText})` : ''}, nous traitons les informations que tu transmets volontairement${nb}: nom, coordonnées, contenu de l’échange, et le cas échéant ton objectif, ton format souhaité et tes disponibilités.`,
        `Finalités${nb}: répondre à ta demande, organiser un rendez-vous et assurer le suivi de l’accompagnement. Base légale${nb}: mesures précontractuelles prises à ta demande, puis exécution du contrat${nb}; intérêt légitime pour les échanges sans suite.`,
        ...(hasWa ? ['Les messages envoyés par WhatsApp sont également soumis aux conditions et à la politique de confidentialité de WhatsApp.'] : []),
      ] },
      ...(hasCal
        ? [{ title: 'Réservation en ligne (Calendly)', id: 'reservation-en-ligne', paragraphs: [
            `La prise de rendez-vous en ligne utilise Calendly, service fourni par Calendly LLC (États-Unis). Le calendrier n’est pas chargé à l’ouverture de la page Réservation${nb}: il ne s’affiche qu’après un clic sur «${nb}Afficher le calendrier de réservation${nb}» ou sur le lien qui ouvre Calendly dans un nouvel onglet.`,
            `À partir de ce clic, Calendly reçoit ton adresse IP et peut déposer ses propres cookies, régis par sa politique de confidentialité. Les informations saisies lors de la réservation (nom, adresse e-mail, créneau choisi, réponses éventuelles) servent à gérer le rendez-vous. Base légale${nb}: mesures précontractuelles prises à ta demande.`,
            'Si tu préfères ne pas utiliser Calendly, tu peux demander un rendez-vous par message depuis la page Contact.',
          ], links: [
            { label: 'Politique de confidentialité de Calendly', href: 'https://calendly.com/privacy' },
          ] } as LegalSection]
        : []),
      { title: 'Informations relatives à ta santé', paragraphs: [
        'Les informations que tu choisis de communiquer sur ta condition physique (par exemple une gêne ou une blessure récente) servent uniquement à adapter les séances en sécurité. Elles ne sont traitées qu’avec ton consentement explicite, que tu peux retirer à tout moment, et ne sont jamais transmises à des tiers. N’envoie que les informations utiles à la pratique sportive.',
      ] },
      { title: 'Destinataires', paragraphs: [
        `Tes données sont destinées uniquement à ${editorName}. Elles ne sont ni vendues, ni louées, ni utilisées pour de la prospection sans ton accord. Des prestataires techniques interviennent pour le fonctionnement du site et des échanges${nb}:`,
      ], list: [
        `${L.host.name}${nb}: hébergement du site.`,
        ...(hasCal ? [`Calendly LLC${nb}: prise de rendez-vous en ligne.`] : []),
        ...(hasWa ? [`WhatsApp${nb}: messagerie, si tu choisis ce canal.`] : []),
        ...(hasMail ? [`Le fournisseur de messagerie électronique de l’éditeur${nb}: réception et conservation des e-mails.`] : []),
      ] },
      { title: 'Transferts hors de l’Union européenne', paragraphs: [
        `Certains de ces prestataires sont établis aux États-Unis. Les transferts de données correspondants sont encadrés par les garanties prévues par le RGPD${nb}: cadre de protection des données UE–États-Unis pour les entreprises certifiées, ou clauses contractuelles types de la Commission européenne.`,
      ] },
      { title: 'Durées de conservation', list: [
        `Échanges sans suite${nb}: trois ans au plus à compter du dernier contact.`,
        `Données liées à un accompagnement${nb}: pendant toute sa durée, puis archivées pendant la durée de prescription légale (cinq ans).`,
        `Pièces comptables, le cas échéant${nb}: dix ans (article L123-22 du Code de commerce).`,
        `Journaux techniques de l’hébergeur${nb}: selon la politique de confidentialité de l’hébergeur.`,
      ] },
      { title: 'Cookies', paragraphs: [
        'Ce site ne dépose aucun cookie, ni de mesure d’audience, ni publicitaire, ni de réseau social.',
        ...(hasCal ? [`Seul le calendrier Calendly, chargé uniquement après ton clic, peut déposer ses propres cookies (voir la section «${nb}Réservation en ligne (Calendly)${nb}»).`] : []),
      ] },
      { title: 'Tes droits', paragraphs: [
        `Conformément au RGPD et à la loi Informatique et Libertés, tu disposes d’un droit d’accès, de rectification, d’effacement, de limitation et d’opposition, d’un droit à la portabilité de tes données, du droit de retirer ton consentement à tout moment et du droit de définir des directives relatives au sort de tes données après ton décès.`,
        `Pour les exercer, écris-nous à l’adresse suivante${nb}: ${val(site.contact.email)}. Une réponse t’est apportée dans un délai d’un mois, prolongeable dans les conditions prévues par le RGPD. Une pièce justificative peut t’être demandée en cas de doute raisonnable sur ton identité.`,
      ] },
      { title: 'Réclamation auprès de la CNIL', paragraphs: [
        'Si tu estimes que tes droits ne sont pas respectés, tu peux adresser une réclamation à la Commission nationale de l’informatique et des libertés (CNIL), 3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07.',
      ], links: [
        { label: 'Site de la CNIL', href: 'https://www.cnil.fr' },
      ] },
    ] as LegalSection[],
  },
};

// ============================================================================
//  DONNÉES OPTIONNELLES — VIDES PAR DÉFAUT, SECTION MASQUÉE TANT QU'ELLES LE SONT
//  N'ajoute ici que des FAITS vérifiables fournis par le propriétaire.
// ============================================================================

/**
 * Témoignages RÉELS uniquement, publiés avec l'accord écrit de leur auteur.
 * Ex. { text: 'Texte exact du retour…', author: 'Prénom N.', detail: 'Programme à distance' }
 */
export const testimonials: Testimonial[] = [
  // TODO (optionnel)
];

/**
 * Diplômes, certifications et formations RÉELLEMENT détenus.
 * Ex. { title: 'Intitulé exact du diplôme', issuer: 'Organisme', year: '2021' }
 */
export const credentials: Credential[] = [
  // TODO (optionnel)
];

/**
 * Chiffres clés RÉELS et vérifiables (jamais estimés).
 * Ex. { value: '2', label: 'formats : présentiel et visio' }
 */
export const stats: Stat[] = [
  // TODO (optionnel)
];

// ================================================ TEXTES PROPRES AU SITE
/* Applique src/data/overrides.ts par-dessus les textes ci-dessus. */
const isPlain = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

function applyOverride(target: any, patch: any): void {
  for (const key of Object.keys(patch)) {
    const next = patch[key];
    const cur = target[key];
    if (Array.isArray(cur) && Array.isArray(next) && next.every(isPlain) && cur.every(isPlain)) {
      next.forEach((item, i) => (cur[i] ? applyOverride(cur[i], item) : cur.push(item)));
    } else if (isPlain(cur) && isPlain(next)) {
      applyOverride(cur, next);
    } else {
      target[key] = next;
    }
  }
}

const overridable: Record<string, unknown> = { ui, home, about, services, booking, contact, notFound, offers };
for (const [key, patch] of Object.entries(overrides)) {
  if (!(key in overridable)) throw new Error(`overrides.ts : clé inconnue « ${key} »`);
  applyOverride(overridable[key], patch);
}

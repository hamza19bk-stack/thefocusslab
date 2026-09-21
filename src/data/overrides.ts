/**
 * TEXTES PROPRES À CE SITE — fusionnés par-dessus src/data/content.ts.
 *
 * Laisse l'objet vide pour garder les textes du template.
 * Clés possibles : ui, home, about, services, booking, contact, notFound, offers.
 * Seules les valeurs indiquées remplacent celles du template ; tout le reste est conservé.
 * Pour `offers` (tableau), l'élément N remplace les champs de la N-ième offre.
 *
 * Mêmes règles que content.ts : aucun fait inventé (chiffres, diplômes, avis),
 * aucune promesse commerciale, aucune allégation médicale, ni prix ni tarif.
 *
 * TheFocussLab — angle : l'entraînement comme un protocole personnel. On teste,
 * on observe, on ajuste : méthode, essais, retours, versions successives du plan.
 * Jamais de caution scientifique (ni études, ni « prouvé », ni laboratoire réel).
 */
import { isSet, nb } from '../lib/utils';
import { site } from './site';

/* Ville ou zone gérée automatiquement par site.ts (jamais écrite en dur ici). */
const place = isSet(site.contact.area) ? site.contact.area : isSet(site.contact.city) ? site.contact.city : '';

export const overrides: Record<string, unknown> = {
  // ================================================================ ACCUEIL
  home: {
    seo: {
      title: place
        ? `Coach sportif à ${place}${nb}: un entraînement testé, observé, ajusté`
        : `Coach sportif${nb}: un entraînement testé, observé, ajusté`,
      description: `Coaching sportif mené comme un protocole personnel${nb}: on essaie, on observe tes retours, on ajuste. Séances en présentiel ou en visio, programme à distance et repères d’hygiène alimentaire.`,
    },
    hero: {
      eyebrow: 'Coaching sportif par essais et ajustements',
      titleLead: 'Chaque séance est un essai,',
      titleMark: 'chaque retour affine le plan',
      lead: 'Aucun plan ne tombe juste du premier coup. On pose une première version, tu la mets à l’épreuve de ta semaine, et tes retours indiquent ce qu’il faut garder ou modifier. Réglage après réglage, ton entraînement devient vraiment le tien.',
      visualLabel: 'Version après version',
    },
    highlights: {
      eyebrow: 'Le protocole',
      title: 'Rien n’est figé, tout se vérifie',
      subtitle: `La démarche tient en quelques gestes simples${nb}: noter d’où tu pars, changer une chose, regarder l’effet, puis décider avec toi.`,
      items: [
        { title: 'Un point de départ noté', text: `Avant le premier essai, on consigne ta situation${nb}: activité actuelle, objectif, contraintes, créneaux. C’est la référence qui permettra de voir ce qui évolue vraiment.` },
        { title: 'Un réglage à la fois', text: `Charge, volume, fréquence ou choix d’un exercice${nb}: on modifie un paramètre, on observe, puis on tranche. Tant que la technique n’est pas en place, la charge attend.` },
        { title: 'Tes retours guident la suite', text: `Fatigue, aisance, envie, gêne éventuelle${nb}: ce que tu remarques pendant et après la séance sert à écrire la version suivante du plan.` },
        { title: 'Des essais à l’échelle de ta semaine', text: 'Un test mené dans ta vraie semaine vaut mieux qu’un plan idéal que personne ne suit. La durée et le format des séances font eux aussi partie des réglages.' },
      ],
    },
    offers: {
      eyebrow: 'Les formats',
      title: 'Choisis le cadre de tes essais',
    },
    method: {
      eyebrow: 'La méthode',
      title: 'De la première version à la suivante',
      subtitle: `Poser une base, l’essayer, regarder, corriger${nb}: la boucle reste la même, seul son contenu t’appartient.`,
      steps: [
        { title: 'Le relevé de départ', text: `On observe avant de proposer${nb}: ton objectif, ta pratique actuelle, ton rythme de vie, ton sommeil, tes créneaux et quelques mouvements simples. Cette photographie sert de référence à chaque essai.` },
        { title: 'Une première version à tester', text: `Tu repars avec un protocole de départ${nb}: séances, enchaînement des exercices, repères d’effort et de récupération. Il est volontairement conçu pour être mis à l’épreuve.` },
        { title: 'Les essais et tes retours', text: 'Tu t’entraînes, tu notes ce que tu ressens, on en parle. Ce qui fonctionne reste, ce qui coince est modifié, et chaque imprévu apporte lui aussi une information utile.' },
        { title: 'La version suivante', text: `À intervalles réguliers, on compare avec le relevé de départ${nb}: force, endurance, mobilité, aisance au quotidien. Chaque comparaison débouche sur un plan mis à jour.` },
      ],
    },
    cta: {
      eyebrow: 'Premier essai',
      title: `On teste une première version${nb}?`,
      lead: 'Une première séance pour noter ton point de départ, choisir ce que l’on essaie d’abord et repartir avec un plan à mettre à l’épreuve.',
    },
  },

  // =============================================================== À PROPOS
  about: {
    seo: {
      title: `À propos${nb}: l’entraînement vu comme un protocole personnel`,
      description: `Une approche du coaching sportif fondée sur l’observation${nb}: essayer, écouter tes retours et ajuster, pour un entraînement qui s’affine avec toi.`,
    },
    hero: {
      eyebrow: 'À propos',
      titleLead: 'Observer avant de décider,',
      titleMark: 'ajuster plutôt que répéter',
      lead: `Ce qui convient à une personne ne convient pas forcément à une autre. Ici, rien n’est supposé d’avance${nb}: on essaie, on regarde ce que cela donne dans ton quotidien et on corrige avec toi. Ta pratique devient un terrain d’essai personnel, suivi avec méthode.`,
    },
    approach: {
      eyebrow: 'L’approche',
      title: 'Une démarche d’essai, pas de dogme',
      subtitle: 'Les règles de méthode qui encadrent chaque réglage, du premier relevé au suivi dans la durée.',
      steps: [
        { title: 'Partir de ce qui est observé', text: 'On s’appuie sur ce que l’on constate chez toi (niveau, emploi du temps, envies, contraintes) plutôt que sur ce qu’un programme type suppose.' },
        { title: 'Tester avant de conclure', text: 'Un exercice, une fréquence ou une intensité se jugent à l’usage. On les essaie dans ta semaine réelle avant de décider s’ils gardent leur place.' },
        { title: 'Écouter tes retours', text: 'Ton ressenti fait partie de la méthode. Ce que tu remarques pendant et après les séances oriente chaque ajustement.' },
        { title: 'Te transmettre la démarche', text: 'À terme, tu sais observer ta propre pratique et la faire évoluer, avec méthode et en sécurité, y compris sans ton coach.' },
      ],
    },
    philosophy: {
      eyebrow: 'La philosophie',
      title: 'Une méthode rigoureuse, un plan qui bouge',
      subtitle: 'Les principes qui encadrent chaque essai, du premier bilan aux versions suivantes.',
      items: [
        { title: 'Progresser par petites corrections', text: `Un réglage précis en apprend davantage qu’un grand changement d’un coup. La technique et la régularité passent devant${nb}; l’intensité monte quand les essais montrent que tu es à l’aise.` },
        { title: 'Dire ce que l’on observe', text: 'Tu sais ce qui est testé, pourquoi, et ce qui en ressort. Quand un essai ne donne rien ou qu’un objectif semble mal calibré, on te le dit sans détour.' },
        { title: 'Garder ce qui résiste au réel', text: 'Un plan brillant sur le papier mais intenable dans ta vie ne sert à rien. On conserve ce qui tient pendant les semaines chargées et les jours de fatigue.' },
      ],
      commitmentsTitle: 'Dans ce protocole',
      commitments: [
        'Un relevé de départ fait sans jugement, quel que soit ton niveau.',
        'Un plan de départ conçu pour être testé dans ton quotidien réel.',
        'Des ajustements expliqués, fondés sur tes retours.',
        'Une méthode que tu peux apprendre à appliquer par toi-même.',
      ],
      notHereTitle: 'Hors protocole',
      notHere: [
        'Un programme figé, appliqué quoi qu’il arrive.',
        'Des résultats annoncés avant même le premier essai.',
        'Des régimes restrictifs ou des compléments présentés comme incontournables.',
        `Des conseils médicaux${nb}: pour toute question de santé, ton médecin reste l’interlocuteur de référence.`,
      ],
      quote: `«${nb}Un plan ne se juge pas sur le papier${nb}: il se juge à l’essai, puis il s’ajuste.${nb}»`,
    },
    values: {
      eyebrow: 'Les valeurs',
      title: 'Ce qui reste constant, d’un essai à l’autre',
      subtitle: 'Des repères stables pendant que le plan, lui, continue d’évoluer.',
      items: [
        { title: 'Écoute', text: 'Tes retours sont une matière de travail. Ce que tu ressens, ce qui te gêne et ce qui te plaît comptent autant que ce que l’on observe.' },
        { title: 'Rigueur', text: 'Des essais menés proprement, une technique précise, des conclusions tirées sans précipitation. Une séance manquée n’a rien d’un échec, c’est une information de plus.' },
        { title: 'Transparence', text: 'Ce qui est testé, la raison de ce choix et ce qu’il donne te sont expliqués. Les modalités pratiques aussi, dès le départ.' },
        { title: 'Régularité', text: 'Un essai isolé ne dit pas grand-chose. Des séances tenues dans la durée rendent chaque observation vraiment utile.' },
      ],
    },
    formats: {
      eyebrow: 'Travailler ensemble',
      title: 'Le même protocole, plusieurs cadres',
      subtitle: `Le cadre varie selon ta situation${nb}; la boucle essai, retour, ajustement ne change pas.`,
      texts: {
        inPerson: `Des séances individuelles en salle, à domicile ou en extérieur${nb}: l’observation se fait sur place et les corrections sont immédiates.`,
        online: `En visio, la séance est guidée en direct${nb}: mouvements observés à l’écran et réglages apportés au fil des séries.`,
        remote: 'Un programme écrit pour toi, mis à l’épreuve de ton quotidien et remis à jour à chaque fin de cycle d’après tes retours.',
      },
    },
    cta: {
      eyebrow: 'La suite',
      title: `On commence par un premier relevé${nb}?`,
      lead: `Raconte ce que tu as déjà essayé${nb}: ce qui a marché, ce qui n’a pas tenu et ce que tu aimerais changer.`,
    },
  },

  // =============================================================== SERVICES
  services: {
    seo: {
      title: `Services${nb}: choisir le cadre de tes essais d’entraînement`,
      description: `Séances individuelles en présentiel ou en visio, programme d’entraînement personnalisé et repères nutritionnels${nb}: chaque format avance par essais, retours et ajustements.`,
    },
    hero: {
      eyebrow: 'Les services',
      titleLead: 'Un cadre pour chaque essai,',
      titleMark: 'une seule méthode',
      lead: `Quel que soit le format, la démarche est identique${nb}: un relevé de départ, un plan adapté à tes contraintes réelles, puis des essais observés et des réglages réguliers.`,
    },
    offers: {
      eyebrow: 'Le détail',
      title: 'Ce que chaque cadre permet de tester',
    },
    common: {
      eyebrow: 'Quel que soit le format',
      title: 'Le socle de la méthode',
      subtitle: `Ces repères valent pour tous les formats${nb}: ils transforment une suite d’essais en progression suivie.`,
      items: [
        { title: 'Un relevé avant tout', text: 'Pas de premier essai sans point de départ noté, contraintes identifiées et objectif dont on sait suivre l’évolution.' },
        { title: 'Des versions successives', text: 'Le programme est revu à partir de tes retours et de tes repères. Chaque version corrige la précédente.' },
        { title: 'Un retour direct', text: `Un exercice qui coince, une séance qui ne passe pas${nb}? Tu le signales directement à ton coach, et le plan en tient compte.` },
        { title: 'Des repères comparables', text: `Répétitions, charges, souffle, ressenti${nb}: des indicateurs simples à comparer d’une séance à l’autre, bien plus parlants que la seule balance.` },
      ],
    },
    process: {
      eyebrow: 'Comment ça se passe',
      title: 'Comment ton protocole se met en place',
      subtitle: `Chaque étape est annoncée${nb}: tu sais dès le départ comment le plan sera construit, puis testé.`,
      steps: [
        { title: 'Le premier message', text: 'Tu réserves une séance ou tu écris. On parle de ton objectif, de tes disponibilités et des méthodes que tu as déjà essayées.' },
        { title: 'Le relevé de départ', text: `Habitudes, niveau, matériel, lieu d’entraînement, points de vigilance éventuels${nb}: on note tout, puis on fixe un objectif réaliste et les repères qui serviront à l’observer.` },
        { title: 'La première version', text: `Le protocole prend forme${nb}: format, fréquence tenable, contenu des séances, succession des cycles. Chaque choix t’est expliqué.` },
        { title: 'Les essais et les ajustements', text: `Les séances s’enchaînent et tes retours sont notés. En fin de cycle, on compare avec le relevé de départ${nb}: on garde ce qui fonctionne et on corrige ce qui coince.` },
      ],
    },
    cta: {
      eyebrow: 'Passer à l’action',
      title: `Quel essai lancer en premier${nb}?`,
      lead: `Le mieux est d’en parler lors d’une première séance${nb}: on note ton point de départ, on fixe un objectif réaliste et on choisit le format de tes premiers essais.`,
    },
  },

  // ============================================================ RÉSERVATION
  booking: {
    seo: {
      title: `Réservation${nb}: lancer la première version de ton plan`,
      description: `Réserve ta séance de coaching sportif${nb}: relevé de départ, objectif réaliste et première version de ton protocole, dans le format qui te convient.`,
    },
    hero: {
      eyebrow: 'Réservation',
      titleLead: 'Le premier relevé',
      titleMark: 'se fait ici',
      lead: `Une séance pour observer ton point de départ, comprendre ton quotidien et décider de ce que l’on teste en premier. Ni épreuve de niveau ni discours commercial${nb}: un bilan franc et une base de travail réaliste.`,
    },
    cta: {
      eyebrow: 'Dernier détail',
      title: 'Une séance pour poser la base',
      lead: 'On relève ton point de départ et on choisit le premier réglage. Tu repars avec une base concrète pour les essais suivants.',
    },
  },

  // ================================================================ CONTACT
  contact: {
    seo: {
      title: `Contact${nb}: raconte tes essais, on ajuste ensemble`,
      description: `Une question sur un format, sur la méthode ou sur un essai en cours${nb}? Écris, appelle ou réserve directement ta séance de coaching sportif.`,
    },
    hero: {
      eyebrow: 'Contact',
      titleLead: `Une idée à tester${nb}?`,
      titleMark: 'Mettons-la à l’essai',
      lead: `Ici, pas de formulaire${nb}: tu écris ou tu appelles, et c’est ton coach qui répond. Explique où tu en es, ce que tu as déjà essayé et ce que tu voudrais changer${nb}; on regarde ensemble si l’accompagnement te correspond.`,
    },
    cta: {
      eyebrow: 'Passer à l’action',
      title: 'Un message aujourd’hui, un premier essai ensuite',
      lead: `Pour une question courte, un message suffit. Pour changer ta façon de t’entraîner, mieux vaut réserver une première séance${nb}: c’est là que se fait le relevé de départ.`,
    },
  },

  // ================================================================= OFFRES
  offers: [
    {
      summary: `Face à face, chaque essai observé de près${nb}: posture corrigée en direct et intensité réglée selon ta forme du jour.`,
      description:
        'Ton coach suit toute la séance à tes côtés. Chaque exécution est observée, la posture corrigée sur le moment et l’intensité réglée selon ta forme. Chaque réglage est expliqué, pour que tu apprennes à lire ta propre pratique.',
      includes: [
        `Relevé de départ${nb}: objectifs, habitudes, niveau d’activité`,
        'Séances en salle, à domicile ou en extérieur, selon la zone couverte',
        'Observation et correction technique, mouvement par mouvement',
        `Points d’étape réguliers${nb}: charges, répétitions, ressenti, réglages`,
      ],
      forWho:
        'Tu veux un regard extérieur sur ta façon de t’entraîner pour savoir quoi ajuster, que tu débutes ou que tu reprennes après une longue coupure.',
    },
    {
      summary: `Le même protocole à distance${nb}: une séance guidée et observée en direct, où que tu sois.`,
      description:
        'La séance se déroule en direct, caméra allumée, chez toi, dans ta salle ou en déplacement. Tes mouvements sont observés à l’écran, les temps de repos tenus, et les corrections arrivent série après série.',
      includes: [
        'Séance guidée en direct, de l’échauffement au retour au calme',
        'Exercices adaptés au matériel disponible, ou sans matériel',
        'Conseils pour placer la caméra et bien voir chaque mouvement',
        'Points à tester ou à corriger d’une séance à l’autre',
      ],
      forWho:
        'Ton emploi du temps bouge, tu voyages ou tu vis loin, et tu veux malgré tout un regard en direct sur tes séances.',
    },
    {
      summary: `Un plan écrit pour toi, pensé pour évoluer${nb}: séances, séries, temps de repos et points d’ajustement.`,
      description:
        'Ton programme part de ton objectif, de ton niveau et du matériel à ta disposition. Chaque séance est détaillée pour que tu saches quoi faire, tes retours sont recueillis au fil du cycle, et une nouvelle version du plan voit le jour à chaque fin de cycle.',
      includes: [
        `Entretien de cadrage${nb}: objectif, contraintes, matériel`,
        'Plan organisé en cycles, avec une progression prévue',
        'Exercices de remplacement si un équipement manque',
        'Nouvelle version du plan en fin de cycle, d’après tes retours',
      ],
      forWho:
        'Tu t’entraînes déjà de ton côté, mais sans vraiment savoir ce qui fonctionne ni quoi changer.',
    },
    {
      summary: `Des repères d’hygiène alimentaire simples, mis à l’épreuve de ton quotidien${nb}: pas de régime, pas d’aliment interdit.`,
      description:
        'Ni régime, ni aliment interdit, ni pesée à chaque repas. On part de tes habitudes actuelles, on propose des repères généraux d’hygiène alimentaire en lien avec ton entraînement, puis on garde ceux qui tiennent vraiment dans ta semaine.',
      includes: [
        'Point sur tes habitudes actuelles, sans jugement',
        'Repères simples pour composer tes repas au quotidien',
        'Organisation des repas autour des séances et des jours de repos',
        'Retour sur les repères essayés, pour garder ceux qui te conviennent',
      ],
      forWho:
        'Tu t’entraînes régulièrement et tu préfères essayer quelques repères concrets plutôt qu’enchaîner les régimes.',
    },
  ],
};

/**
 * Sélecteurs de données partagés par les pages (aucun texte ici).
 */
import { site } from '../data/site';
import { offers, type FaqItem, type ModeKey, type Offer } from '../data/content';
import { isSet, phoneHref } from './utils';

export const modesOn = (Object.keys(site.contact.modes) as ModeKey[]).filter((k) => site.contact.modes[k]);

/** Une entrée dépendant de formats désactivés disparaît. */
export function forModes<T extends { requires?: ModeKey[] }>(items: T[]): T[] {
  return items.filter((i) => !i.requires || i.requires.every((k) => site.contact.modes[k]));
}

export function visibleFaq(items: FaqItem[]): FaqItem[] {
  return forModes(items).filter((i) => isSet(i.q) && isSet(i.a));
}

/** Offres des formats réellement proposés. */
export const activeOffers: Offer[] = offers.filter((o) => o.mode === null || site.contact.modes[o.mode]);

export const brandSet = isSet(site.brand.name);
export const hasEmail = isSet(site.contact.email);
export const hasPhone = isSet(site.contact.phone);
export const hasWhatsapp = isSet(site.social.whatsapp);
export const hasCalendly = isSet(site.booking.calendlyUrl);
export const hasCtaNote = isSet(site.booking.ctaNote);
export const telHref = hasPhone ? `tel:${phoneHref(site.contact.phone)}` : '';

export function mailto(subject: string, body: string): string {
  if (!hasEmail) return '';
  return `mailto:${site.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function faqJsonLd(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  };
}

/**
 * Utilitaires partagés — src/lib/utils.ts
 *
 * RÈGLE UNIQUE « NE JAMAIS PUBLIER UN PLACEHOLDER » :
 * une valeur est « renseignée » seulement si isSet(v) renvoie true.
 * Est considéré comme NON renseigné : undefined, null, '' (ou espaces),
 * et toute chaîne commençant par « TODO ». Aucun autre helper du même
 * genre ne doit exister ailleurs (vérifié par scripts/check.mjs).
 */

export function isSet(v: unknown): boolean {
  if (v === undefined || v === null) return false;
  if (typeof v === 'string') {
    const t = v.trim();
    return t !== '' && !t.startsWith('TODO');
  }
  if (typeof v === 'number') return Number.isFinite(v);
  if (typeof v === 'boolean') return v;
  return true;
}

/**
 * Espace insécable (U+00A0), à écrire avant : ; ! ? et à l'intérieur des « »
 * dans les chaînes JS et les props (l'entité &nbsp; n'y est pas décodée).
 */
export const nb = ' ';

/**
 * Numéro affiché -> valeur pour un lien tel: (format international).
 * « 06 12 34 56 78 » -> « +33612345678 » ; « +33 6 … » est conservé.
 */
export function phoneHref(phone: string): string {
  if (!isSet(phone)) return '';
  const digits = phone.replace(/[^\d+]/g, '');
  if (digits.startsWith('+')) return digits;
  if (digits.startsWith('00')) return `+${digits.slice(2)}`;
  if (digits.startsWith('0') && digits.length === 10) return `+33${digits.slice(1)}`;
  return digits;
}

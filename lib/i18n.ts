export type Locale = 'en' | 'ar';

export function getLocalizedValue(value: { en: string; ar: string } | undefined | null, locale: Locale): string {
  if (!value) return '';
  return value[locale] || value.en || value.ar || '';
}

export function getDirection(locale: Locale): 'ltr' | 'rtl' {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

export function formatDate(date: string | null, locale: Locale): string {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  const months = {
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    ar: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  };
  return `${months[locale][d.getMonth()]} ${d.getFullYear()}`;
}

export function formatDateRange(start: string | null, end: string | null, isCurrent: boolean, locale: Locale): string {
  const startStr = formatDate(start, locale);
  let endStr = '';
  if (isCurrent) {
    endStr = locale === 'ar' ? 'حتى الآن' : 'Present';
  } else {
    endStr = formatDate(end, locale);
  }
  return `${startStr} — ${endStr}`;
}

// import 'server-only';
import type { Locale } from '@/i18n.config';

const dictionaries = {
    en: ()=> import('@/locales/en.json').then(module => module.default),
    ar: ()=> import('@/locales/ar.json').then(module => module.default),
}

const getDictionary = async (locale: Locale) => {
    const dictionary = await dictionaries[locale]();
    return dictionary
}

export default getDictionary
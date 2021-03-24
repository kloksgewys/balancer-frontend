import { createI18n } from 'vue-i18n';

import messagesEN from '@/translations/en.json';

export const defaultLang = 'en';
  
const i18n = createI18n({
    legacy: false,
    locale: defaultLang,
    globalInjection: true,
    fallbackLocale: defaultLang,
    messages: {
        en: messagesEN,
    },
});

export default i18n;
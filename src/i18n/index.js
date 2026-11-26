import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import en from './en.json';
import fr from './fr.json';

export const i18n = new I18n({ en, fr });
i18n.enableFallback = true;
i18n.defaultLocale = 'en';
i18n.locale = Localization.getLocales()[0]?.languageCode ?? 'en';
export const t = (k) => i18n.t(k);

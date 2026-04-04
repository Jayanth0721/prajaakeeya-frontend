import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en.json';
import kn from './locales/kn.json';
import hi from './locales/hi.json';
import bn from './locales/bn.json';
import te from './locales/te.json';
import ta from './locales/ta.json';
import mr from './locales/mr.json';
import gj from './locales/gj.json';
import ma from './locales/ma.json';
import od from './locales/od.json';
import rj from './locales/rj.json';
import br from './locales/br.json';

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    load: 'languageOnly',
    supportedLngs: ['en', 'kn', 'hi', 'bn', 'te', 'ta', 'mr', 'gj', 'ma', 'od', 'rj', 'br'],
    resources: {
      en: { translation: en },
      kn: { translation: kn },
      hi: { translation: hi },
      bn: { translation: bn },
      te: { translation: te },
      ta: { translation: ta },
      mr: { translation: mr },
      gj: { translation: gj },
      ma: { translation: ma },
      od: { translation: od },
      rj: { translation: rj },
      br: { translation: br },
    },
    interpolation: { escapeValue: false }
  });

export default i18n;

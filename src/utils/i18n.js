const NextI18Next = require('next-i18next').default;

const instance = new NextI18Next({
  defaultLanguage: 'uk',
  otherLanguages: ['en', 'lat'],
  browserLanguageDetection: false,
  localeExtension: 'json',
  localeSubpaths: {
    uk: 'uk',
    en: 'en',
    lat: 'lat',
  },
  detection: {
    lookupCookie: 'locale',
    order: ['cookie', 'querystring', 'path'],
  },
});

module.exports = instance;

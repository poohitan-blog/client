const codes = {
  en: 'gb',
  de: 'de',
  uk: 'ua',
};

const postIsAvailableInThisLanguagePhrases = {
  en: 'This post is available in English',
  uk: 'Цей запис можна прочитати українською',
};

export function getCountryCodeByLanguageCode(languageCode) {
  return codes[languageCode];
}

export function translatePostIsAvailableInThisLanguage(languageCode) {
  return postIsAvailableInThisLanguagePhrases[languageCode];
}

export default {
  getCountryCodeByLanguageCode,
  translatePostIsAvailableInThisLanguage,
};

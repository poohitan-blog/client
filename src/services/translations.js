const codes = {
  en: 'gb',
  de: 'de',
  uk: 'ua',
};

const postIsAvailableInThisLanguagePhrases = {
  en: 'Available in English',
  uk: 'Читати українською',
};

export function getCountryCodeByLanguageCode(languageCode) {
  return codes[languageCode] || languageCode;
}

export function translatePostIsAvailableInThisLanguage(languageCode) {
  return postIsAvailableInThisLanguagePhrases[languageCode] || '';
}

export default {
  getCountryCodeByLanguageCode,
  translatePostIsAvailableInThisLanguage,
};

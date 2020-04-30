const alphabet = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  ґ: 'ğ',
  д: 'd',
  е: 'e',
  є: 'je',
  ж: 'ž',
  з: 'z',
  и: 'y',
  і: 'i',
  ї: 'ї',
  й: 'j',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'h',
  ц: 'c',
  ч: 'č',
  ш: 'š',
  щ: 'šč',
  ь: '',
  ю: 'ju',
  я: 'ja',
  А: 'A',
  Б: 'B',
  В: 'V',
  Г: 'G',
  Ґ: 'Ğ',
  Д: 'D',
  Е: 'E',
  Є: 'Je',
  Ж: 'Ž',
  З: 'Z',
  И: 'Y',
  І: 'I',
  Ї: 'Ї',
  Й: 'J',
  К: 'K',
  Л: 'L',
  М: 'M',
  Н: 'N',
  О: 'O',
  П: 'P',
  Р: 'R',
  С: 'S',
  Т: 'T',
  У: 'U',
  Ф: 'F',
  Х: 'H',
  Ц: 'C',
  Ч: 'Č',
  Ш: 'Š',
  Щ: 'Šč',
  Ю: 'Ju',
  Я: 'Ja',
};

const soft = {
  нь: 'ń',
  ль: 'ľ',
  ть: 'ť',
  ць: 'ć',
  рь: 'ŕ',
  дь: 'ď',
  зь: 'ź',
  сь: 'ś',
  Нь: 'Ń',
  Ль: 'Ľ',
  Ть: 'Ť',
  Ць: 'Ć',
  Рь: 'Ŕ',
  Дь: 'Ď',
  Зь: 'Ź',
  Сь: 'Ś',
};

const substitutions = {
  ...soft,
  ...alphabet,
};

function transliterate(text) {
  return Object.keys(substitutions)
    .reduce((accumulator, item) => {
      const substitution = substitutions[item];

      return accumulator.replace(new RegExp(item, 'g'), substitution);
    }, text);
}

export default transliterate;

module.exports = transliterate;

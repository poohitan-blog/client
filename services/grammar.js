import {
  format,
  isValid,
  isToday,
  isYesterday,
  getHours,
} from 'date-fns';
import { uk } from 'date-fns/locale';

// e.g.: pluralizeWord(5, ['ровер', 'ровери', 'роверів'])
export function describeWordCount(count, [one, twoToFour, rest]) {
  if (!count) {
    return `Немає ${rest}`;
  }

  if (count === 1) {
    return `Один ${one}`;
  }

  const lastTwoDigits = count > 9 ? count % 100 : null;
  const lastDigit = count % 10;

  if (lastTwoDigits >= 10 && lastTwoDigits <= 20) {
    return `${count} ${rest}`;
  }

  if (lastDigit === 1) {
    return `${count} ${one}`;
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return `${count} ${twoToFour}`;
  }

  return `${count} ${rest}`;
}

export function createWordCountDescriptor([one, twoToFour, rest]) {
  return (count) => describeWordCount(count, [one, twoToFour, rest]);
}

export function formatPostDate(date) {
  if (!isValid(date)) {
    return 'Неправильна дата';
  }

  const timePrefix = getHours(date) === 11 ? 'об' : 'о';

  if (isToday(date)) {
    return `Сьогодні ${timePrefix} ${format(date, 'HH:mm')}`;
  }

  if (isYesterday(date)) {
    return `Вчора ${timePrefix} ${format(date, 'HH:mm')}`;
  }

  return format(date, 'd MMMM yyyy', { locale: uk });
}

const HTTPDescriptions = {
  401: 'Вимітайся, тобі тут не раді.',
  403: 'Вимітайся, тобі тут не раді.',
  404: 'Такої сторінки тут немає.',
};

export function describeHTTPCode(code) {
  return HTTPDescriptions[code] || 'З невідомої причини шось пішло не так. Спробуйте оновити сторінку.';
}

export default {
  describeWordCount,
  createWordCountDescriptor,
  formatPostDate,
  describeHTTPCode,
};

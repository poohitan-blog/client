import moment from 'moment';

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
  return count => describeWordCount(count, [one, twoToFour, rest]);
}

export function formatPostDate(date) {
  moment.locale('uk');

  const todayStart = moment().startOf('day');
  const yesterdayStart = moment().startOf('day').subtract(1, 'days');
  const target = moment(date);
  const targetDateIsToday = todayStart.date() === target.date()
    && todayStart.month() === target.month()
    && todayStart.year() === target.year();
  const targetDateIsYesterday = yesterdayStart.date() === target.date()
    && yesterdayStart.month() === target.month()
    && yesterdayStart.year() === target.year();
  const oOrOb = target.hours() === 11 ? 'об' : 'о';

  if (targetDateIsToday) {
    return `Сьогодні ${oOrOb} ${target.format('HH:mm')}`;
  }

  if (targetDateIsYesterday) {
    return `Вчора ${oOrOb} ${target.format('HH:mm')}`;
  }

  return `${target.format('D MMMM YYYY')} ${oOrOb} ${target.format('HH:mm')}`;
}

const HTTPDescriptions = {
  401: 'Вимітайся, тобі тут не раді.',
  403: 'Вимітайся, тобі тут не раді.',
  404: 'Такої сторінки тут немає.',
};

export function describeHTTPCode(code) {
  return HTTPDescriptions[code] || 'З невідомої причини шось пішло не так.';
}

export default {
  describeWordCount,
  createWordCountDescriptor,
  formatPostDate,
  describeHTTPCode,
};

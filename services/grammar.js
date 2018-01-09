import moment from 'moment';

export function describeCommentsCount(count) {
  if (!count) {
    return 'Немає коментарів';
  }

  if (count === 1) {
    return 'Один коментар';
  }

  const lastTwoDigits = count > 9 ? count % 100 : null;
  const lastDigit = count % 10;

  if (lastTwoDigits >= 10 && lastTwoDigits <= 20) {
    return `${count} коментарів`;
  }

  if (lastDigit === 1) {
    return `${count} коментар`;
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return `${count} коментарі`;
  }

  return `${count} коментарів`;
}

export function formatPostDate(date) {
  moment.locale('uk');

  const todayStart = moment().startOf('day');
  const yesterdayStart = moment().startOf('day').subtract(1, 'days');
  const target = moment(date);
  const hoursPassed = todayStart.diff(target, 'hours');
  const oOrOb = target.hours() === 11 ? 'об' : 'о';

  if (todayStart.date() === target.date() && todayStart.month() === target.month() && todayStart.year() === target.year()) {
    return `Сьогодні ${oOrOb} ${target.format('HH:mm')}`;
  }

  if (yesterdayStart.date() === target.date() && yesterdayStart.month() === target.month() && yesterdayStart.year() === target.year()) {
    return `Вчора ${oOrOb} ${target.format('HH:mm')}`;
  }

  return `${target.format('D MMMM YYYY')} ${oOrOb} ${target.format('HH:mm')}`;
}

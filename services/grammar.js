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

export default { describeCommentsCount };

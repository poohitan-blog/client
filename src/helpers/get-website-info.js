import {
  parse,
  getDate,
  getMonth,
  differenceInYears,
} from 'date-fns';

const BIRTHDAY_DATE = parse('2010-03-17', 'yyyy-MM-dd', new Date());

export default function getWebsiteInfo() {
  const today = new Date();
  const isBirthday = getDate(BIRTHDAY_DATE) === getDate(today) && getMonth(BIRTHDAY_DATE) === getMonth(today);
  const age = differenceInYears(today, BIRTHDAY_DATE);

  return {
    isBirthday,
    age,
  };
}

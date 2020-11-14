import { endOfToday } from 'date-fns';
import { parseCookies, setCookie } from 'nookies';

import random from 'helpers/random';

const COOKIE_NAME = 'raspberriesDay';
const LUCKY_NUMBER_PARAMS = { min: 1, max: 20 };

function runLottery(req, res) {
  const cookies = parseCookies({ req });
  const cookie = cookies[COOKIE_NAME];

  if (cookie) {
    return cookie === 'true';
  }

  const luckyNumber = random(LUCKY_NUMBER_PARAMS);
  const userNumber = random(LUCKY_NUMBER_PARAMS);
  const wonLottery = userNumber === luckyNumber;

  const expires = endOfToday();

  setCookie({ res }, COOKIE_NAME, wonLottery, { expires });

  return wonLottery;
}

export default { runLottery };

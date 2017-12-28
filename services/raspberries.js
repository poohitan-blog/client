import moment from 'moment';
import Cookies from '../services/cookies';
import random from '../helpers/random';

const COOKIE_NAME = 'raspberriesDay';
const LUCKY_NUMBER = { min: 1, max: 5 };

function getCookie(req) {
  const cookie = Cookies.get(COOKIE_NAME, req);

  return cookie;
}

function setCookie(wonLottery, res) {
  const cookieExpirationDate = moment().endOf('day').toDate();

  Cookies.set(COOKIE_NAME, wonLottery, { expires: cookieExpirationDate }, res);
}

function runLottery(req, res) {
  const cookie = getCookie(req);

  if (cookie) {
    return cookie === 'true';
  }

  const luckyNumber = random(LUCKY_NUMBER);
  const usersNumber = random(LUCKY_NUMBER);
  const wonLottery = usersNumber === luckyNumber;

  setCookie(wonLottery, res);

  return wonLottery;
}

export default { runLottery };

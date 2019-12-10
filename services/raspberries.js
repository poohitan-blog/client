import { endOfToday } from 'date-fns';
import Cookies from './cookies';
import random from '../helpers/random';

const COOKIE_NAME = 'raspberriesDay';
const LUCKY_NUMBER = { min: 1, max: 10 };

function getCookie(req) {
  const cookie = Cookies.get(COOKIE_NAME, req);

  return cookie;
}

function setCookie(wonLottery, res) {
  const expires = endOfToday().toUTCString();

  Cookies.set(COOKIE_NAME, wonLottery, { expires }, res);
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

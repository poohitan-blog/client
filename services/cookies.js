import { current } from '../config';

export function getCookie(name, req) {
  if (req) {
    return req.cookies[name];
  }

  const matches = global.document.cookie.match(new RegExp(`(?:^|; )${name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1')}=([^;]*)`));

  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function setCookie(name, value, options = {}, res) {
  const { expires, httpOnly = false } = options;

  if (res) {
    res.cookie(name, value, { expires: new Date(expires), httpOnly, domain: current.cookiesDomain });

    return;
  }

  let cookie = `${name}=${encodeURIComponent(value)}; domain=${current.cookiesDomain}`;

  if (expires) {
    cookie += `; expires=${expires}`;
  }

  if (httpOnly) {
    cookie += '; HttpOnly';
  }

  global.document.cookie = cookie;
}

export function deleteCookie(name, res) {
  setCookie(name, '', { expires: new Date(0).toUTCString() }, res);
}

export function stringifyCookies(req) { // TODO: don't miss cookie options (httpOnly, expires, etc.)
  if (!req) {
    return global.document.cookies;
  }

  const { cookies } = req;

  return Object.keys(cookies).map(cookieName => `${cookieName}=${cookies[cookieName]}`).join('; ');
}

export function getAllCookies(req) {
  if (req) {
    return stringifyCookies(req);
  }

  return global.document.cookie;
}

export default {
  get: getCookie,
  set: setCookie,
  delete: deleteCookie,
  getAll: getAllCookies,
  stringify: stringifyCookies,
};

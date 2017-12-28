import moment from 'moment';

export function getCookie(name) {
  const matches = global.document.cookie.match(new RegExp(`(?:^|; )${name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1')}=([^;]*)`));

  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function setCookie(name, value, { expires } = {}) {
  const expirationDate = expires ? moment(expires).toUTCString() : null;

  let updatedCookie = `${name}=${encodeURIComponent(value)}`;

  if (expirationDate) {
    updatedCookie += `; expires=${expirationDate}`;
  }

  global.document.cookie = updatedCookie;
}

export default { get: getCookie, set: setCookie };

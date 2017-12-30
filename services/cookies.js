export function getCookie(name, req) {
  if (req) {
    return req.cookies[name];
  }

  const matches = global.document.cookie.match(new RegExp(`(?:^|; )${name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1')}=([^;]*)`));

  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function setCookie(name, value, options = {}, res) {
  const { expires, httpOnly } = options;

  if (res) {
    res.cookie(name, value, { expires: new Date(expires), httpOnly });

    return;
  }

  let cookie = `${name}=${encodeURIComponent(value)}`;

  if (expires) {
    cookie += `; expires=${expires}`;
  }

  if (httpOnly) {
    cookie += '; HttpOnly';
  }

  global.document.cookie = cookie;
}

export function stringifyCookies(cookies) { // TODO: don't miss cookies options (httpOnly, expires, etc.)
  return Object.keys(cookies).map(cookieName => `${cookieName}=${cookies[cookieName]}`).join('; ');
}

export function getAllCookies(req) {
  if (req) {
    return stringifyCookies(req.cookies);
  }

  return global.document.cookie;
}

export default {
  get: getCookie,
  set: setCookie,
  getAll: getAllCookies,
  stringify: stringifyCookies,
};

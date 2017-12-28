export function getCookie(name, req) {
  if (req) {
    return req.cookies[name];
  }

  const matches = global.document.cookie.match(new RegExp(`(?:^|; )${name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1')}=([^;]*)`));

  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function setCookie(name, value, { expires } = {}, res) {
  if (res) {
    res.cookie(name, value, { expires });

    return;
  }

  const expirationDate = expires ? expires.toUTCString() : null;

  let updatedCookie = `${name}=${encodeURIComponent(value)}`;

  if (expirationDate) {
    updatedCookie += `; expires=${expirationDate}`;
  }

  global.document.cookie = updatedCookie;
}

export default { get: getCookie, set: setCookie };

import fetch from 'isomorphic-unfetch';
import queryString from 'query-string';

export default async function request(params) {
  const {
    url,
    query,
    method = 'GET',
    headers = {},
    body,
    formData,
    cookies,
    credentials = 'include',
  } = params;
  let requestUrl = url;

  if (query) {
    requestUrl += `?${queryString.stringify(query)}`;
  }

  const defaultHeaders = formData ? {} : { 'Content-Type': 'application/json' };

  if (cookies) {
    defaultHeaders.Cookie = Object.keys(cookies).reduce((string, cookieName) => {
      const cookieValue = cookies[cookieName];

      return `${string}; ${cookieName}=${cookieValue}`;
    }, '');
  }

  const response = await fetch(requestUrl, {
    method,
    body: formData ? body : JSON.stringify(body),
    headers: { ...defaultHeaders, ...headers },
    credentials,
  });

  const text = await response.text();

  try {
    const json = JSON.parse(text);

    // TODO: maybe it's better not to throw an error when request resulted in non-success status code.
    // Maybe it's better to return an object with response and status instead (and a boolean flag "error")?
    if (!response.ok) {
      throw json;
    }

    return json;
  } catch (error) {
    return text;
  }
}

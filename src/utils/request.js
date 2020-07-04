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
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    credentials,
  });

  const text = await response.text();
  let result;

  try {
    result = JSON.parse(text);
  } catch (error) {
    result = text;
  }

  if (!response.ok) {
    throw result;
  }

  return result;
}

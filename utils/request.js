import fetch from 'isomorphic-unfetch';
import queryString from 'query-string';

export default async function request(params) {
  const {
    url,
    query,
    method = 'GET',
    headers = {},
    body,
  } = params;
  let requestUrl = url;

  if (query) {
    requestUrl += `?${queryString.stringify(query)}`;
  }

  const response = await fetch(requestUrl, {
    method,
    body: body ? JSON.stringify(body) : null,
    headers: Object.assign({
      'Content-Type': 'application/json',
    }, headers),
    credentials: 'include',
  });

  const json = await response.json();

  // TODO: maybe it's better not to throw an error when request resulted in non-success status code.
  // Maybe return an object with response and status instead (and a boolean "error")?
  if (!response.ok) {
    throw json;
  }

  return json;
}

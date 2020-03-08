import React from 'react';
import Router from 'next/router';
import decodeJWT from 'jwt-decode';
import { parseCookies, destroyCookie } from 'nookies';

import { current } from '../config';
import request from '../utils/request';

export const Context = React.createContext({
  isAuthenticated: false,
  pages: [],
  drafts: [],
});

Context.displayName = 'SessionContext';

export async function authenticate({ login, password }) {
  return request({
    url: `${current.apiURL}/authenticate`,
    method: 'POST',
    body: {
      login,
      password,
    },
  });
}

export function isAuthenticated(req) {
  try {
    const { token } = parseCookies({ req });
    const decoded = decodeJWT(token);

    return Boolean(decoded.id);
  } catch (error) {
    return false;
  }
}

export function getToken(req) {
  const { token } = parseCookies({ req });

  return token;
}

export function logOut() {
  destroyCookie({}, 'token');
  Router.push('/');
}

export default {
  authenticate,
  isAuthenticated,
  getToken,
  logOut,
  Context,
};

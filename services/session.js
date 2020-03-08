import React from 'react';
import Router from 'next/router';
import decodeJWT from 'jwt-decode';
import { parseCookies, destroyCookie } from 'nookies';

import { authenticate } from './api';
import { current } from '../config';

export const Context = React.createContext({
  isAuthenticated: false,
  pages: [],
  drafts: [],
});

Context.displayName = 'SessionContext';

export async function logIn(login, password) {
  return authenticate(login, password);
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
  destroyCookie({}, 'token', {
    domain: current.cookiesDomain,
  });
  Router.push('/');
}

export default {
  logIn,
  isAuthenticated,
  getToken,
  logOut,
  Context,
};

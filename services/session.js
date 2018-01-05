import Router from 'next/router';
import decodeJWT from 'jwt-decode';

import { current } from '../config';
import Cookies from './cookies';
import request from '../utils/request';

async function authenticate({ login, password }) {
  return request({
    url: `${current.apiURL}/authenticate`,
    method: 'POST',
    body: {
      login,
      password,
    },
  });
}

function isAuthenticated(req) {
  try {
    const token = Cookies.get('token', req);
    const decoded = decodeJWT(token);

    return Boolean(decoded.id);
  } catch (error) {
    return false;
  }
}

function getToken(req) {
  return Cookies.get('token', req);
}

function logOut() {
  Cookies.delete('token');
  Router.push('/');
}

export default {
  authenticate,
  isAuthenticated,
  getToken,
  logOut,
};

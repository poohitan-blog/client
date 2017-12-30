import config from '../config';
import Cookies from './cookies';
import request from '../utils/request';

async function authenticate({ login, password }) {
  return request({
    url: `${config.current.apiURL}/authenticate`,
    method: 'POST',
    body: {
      login,
      password,
    },
  });
}

function isAuthenticated(req) {
  return Boolean(Cookies.get('token', req));
}

function getToken(req) {
  return Cookies.get('token', req);
}

export default { authenticate, isAuthenticated, getToken };
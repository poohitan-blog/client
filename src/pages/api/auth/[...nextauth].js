import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { authenticate } from 'services/api';

import { current } from 'config';

const providers = [
  Providers.Credentials({
    name: 'Credentials',
    async authorize({ login, password }) {
      return authenticate(login, password);
    },
  }),
];

const callbacks = {
  async jwt(decryptedJWT, responseFromBackend) {
    if (responseFromBackend) {
      const { token, user } = responseFromBackend;

      return {
        user,
        accessToken: token,
      };
    }

    return decryptedJWT;
  },

  async session(session, token) {
    return {
      ...session,
      user: token.user,
    };
  },
};

const cookies = {
  sessionToken: {
    name: 'session-token',
    options: {
      httpOnly: false,
      sameSite: 'lax',
      path: '/',
      domain: current.cookiesDomain,
      secure: current.environment === 'production',
    },
  },
};

const pages = {
  signIn: '/login',
};

const session = {
  jwt: true,
  maxAge: 7 * 24 * 60 * 60, // 7 days
};

export default (req, res) => NextAuth(req, res, {
  providers,
  callbacks,
  cookies,
  pages,
  session,
});

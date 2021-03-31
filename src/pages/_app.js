import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { Provider } from 'next-auth/client';
import NextNProgress from 'nextjs-progressbar';
import { DefaultSeo } from 'next-seo';

import { current } from 'config';

import Error from 'pages/_error';
import AdminPanel from 'components/admin/Panel';

import { config, library } from '@fortawesome/fontawesome-svg-core';
import {
  faHome,
  faBook,
  faGhost,
  faEyeSlash,
  faTimes,
  faCheck,
  faEdit,
  faCalendarAlt,
  faCommentAlt,
  faAngleDoubleDown,
  faSearch,
  faPaperPlane,
  faDove, faCrow,
} from '@fortawesome/free-solid-svg-icons';

import 'styles/global.scss';

config.autoAddCss = false;

library.add(
  faHome, faBook, faGhost,
  faEyeSlash, faEdit, faCheck, faTimes,
  faCommentAlt, faCalendarAlt,
  faAngleDoubleDown,
  faSearch,
  faPaperPlane,
  faDove, faCrow,
);

function App({ Component, pageProps }) {
  if (pageProps.errorCode) {
    return <Error statusCode={pageProps.errorCode} />;
  }

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" key="viewport" />
      </Head>
      <DefaultSeo
        titleTemplate={`%s - ${current.meta.title}`}
        description={current.meta.description}
        keywords={current.meta.keywords}
      />
      <NextNProgress color="#f59300" height="2" options={{ showSpinner: false }} />
      <Provider session={pageProps.session}>
        <AdminPanel />
        <Component {...pageProps} /> {/* eslint-disable-line */}
      </Provider>
    </>
  );
}

App.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.shape({
    session: PropTypes.shape({}),
    errorCode: PropTypes.number,
  }).isRequired,
};

export default App;

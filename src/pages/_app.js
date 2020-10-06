import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

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
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" key="viewport" />
      </Head>
      <Component {...pageProps} /> {/* eslint-disable-line */}
    </>
  );
}

App.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.shape({}).isRequired,
};

export default App;

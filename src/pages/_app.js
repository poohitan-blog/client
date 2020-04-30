import PropTypes from 'prop-types';
import App from 'next/app';

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
} from '@fortawesome/free-solid-svg-icons';

import { appWithTranslation } from 'Utils/i18n';

import 'Styles/global.scss';

config.autoAddCss = false;

library.add(
  faHome, faBook, faGhost,
  faEyeSlash, faEdit, faCheck, faTimes,
  faCommentAlt, faCalendarAlt,
  faAngleDoubleDown,
  faSearch,
  faPaperPlane,
);

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />; // eslint-disable-line
}

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);
  return { ...appProps };
};

MyApp.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.shape({}).isRequired,
};

export default appWithTranslation(MyApp);

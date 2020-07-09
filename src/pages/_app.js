import PropTypes from 'prop-types';

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

import 'styles/global.scss';

config.autoAddCss = false;

library.add(
  faHome, faBook, faGhost,
  faEyeSlash, faEdit, faCheck, faTimes,
  faCommentAlt, faCalendarAlt,
  faAngleDoubleDown,
  faSearch,
  faPaperPlane,
);

function App({ Component, pageProps }) {
  return <Component {...pageProps} />; // eslint-disable-line
}

App.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.shape({}).isRequired,
};

export default App;

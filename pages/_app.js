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
} from '@fortawesome/free-solid-svg-icons';

import '../styles/global.scss';

config.autoAddCss = false;

library.add(
  faHome, faBook, faGhost,
  faEyeSlash, faEdit, faCheck, faTimes,
  faCommentAlt, faCalendarAlt,
  faAngleDoubleDown,
  faSearch,
);

export default function MyApp({ Component, pageProps }) { // eslint-disable-line
  return <Component {...pageProps} />; // eslint-disable-line
}

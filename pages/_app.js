
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faHome,
  faBook,
  faSkull,
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

library.add(
  faHome, faBook, faSkull,
  faEyeSlash, faEdit, faCheck, faTimes,
  faCommentAlt, faCalendarAlt,
  faAngleDoubleDown,
  faSearch,
);

export default function MyApp({ Component, pageProps }) { // eslint-disable-line
  return <Component {...pageProps} />; // eslint-disable-line
}

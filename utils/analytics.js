import ReactGA from 'react-ga';
import { current } from '../config';

export const initGoogleAnalytics = () => {
  ReactGA.initialize(current.google.analyticsTrackingId);
};

export const init = () => {
  initGoogleAnalytics();
};

export const logPageView = () => {
  console.log(`Logging pageview for ${global.location.pathname}`);

  ReactGA.set({ page: global.location.pathname });
  ReactGA.pageview(global.location.pathname);
};

export default {
  initGoogleAnalytics,
  init,
  logPageView,
};

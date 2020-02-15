import ReactGA from 'react-ga';
import { current } from '../config';

export const initGoogleAnalytics = () => {
  ReactGA.initialize(current.google.analyticsTrackingId);
};

export const init = () => {
  initGoogleAnalytics();
};

export const logPageView = () => {
  if (!global.ANALYTICS_INITIALIZED) {
    init();

    global.ANALYTICS_INITIALIZED = true;
  }

  console.info(`Logging pageview for ${global.location.pathname}`);

  ReactGA.set({ page: global.location.pathname });
  ReactGA.pageview(global.location.pathname);
};

export default {
  initGoogleAnalytics,
  init,
  logPageView,
};

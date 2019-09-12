import ReactGA from 'react-ga';
import ReactPixel from 'react-facebook-pixel';
import { current } from '../config';

export const initGoogleAnalytics = () => {
  ReactGA.initialize(current.google.analyticsTrackingId);
};

export const initFacebookPixel = () => {
  ReactPixel.init(current.facebook.pixel);
};

export const init = () => {
  initGoogleAnalytics();
  initFacebookPixel();
};

export const logPageView = () => {
  console.log(`Logging pageview for ${global.location.pathname}`);

  ReactGA.set({ page: global.location.pathname });
  ReactGA.pageview(global.location.pathname);
  ReactPixel.pageView();
};

export default {
  initGoogleAnalytics,
  initFacebookPixel,
  init,
  logPageView,
};

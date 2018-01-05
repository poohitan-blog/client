import ReactGA from 'react-ga';
import { current } from '../config';

export const initGA = () => {
  ReactGA.initialize(current.google.analyticsTrackingId);
};

export const logPageView = () => {
  console.log(`Logging pageview for ${global.location.pathname}`);

  ReactGA.set({ page: global.location.pathname });
  ReactGA.pageview(global.location.pathname);
};

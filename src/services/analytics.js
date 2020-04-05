import ReactGA from 'react-ga';

import { current } from 'Config';
import { analytics } from 'Services/api';

const flow = [];

export const initGoogleAnalytics = () => {
  ReactGA.initialize(current.google.analyticsTrackingId);
};

export const init = () => {
  initGoogleAnalytics();
};

export const logPageView = (path) => {
  if (!path) {
    return;
  }

  if (!global.ANALYTICS_INITIALIZED) {
    init();

    global.ANALYTICS_INITIALIZED = true;
  }

  console.info(`Logging pageview for ${path}`);

  flow.push({ timestamp: Date.now(), path });

  if (current.environment === 'production') {
    ReactGA.pageview(path);
  }
};

export const submitFlow = () => {
  flow.push({ timestamp: Date.now() });
  analytics.submitFlow(flow);
};

export default {
  initGoogleAnalytics,
  init,
  logPageView,
  submitFlow,
};

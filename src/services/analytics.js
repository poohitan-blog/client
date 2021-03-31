import ReactGA from 'react-ga';

import { current } from 'config';
import { analytics } from 'services/api';

const flow = [];

export const initGoogleAnalytics = () => {
  ReactGA.initialize(current.google.analyticsTrackingId);
};

export const init = () => {
  initGoogleAnalytics();
};

export const logPageView = (path, isAuthenticated) => {
  if (!path) {
    return;
  }

  if (!global.ANALYTICS_INITIALIZED) {
    init();

    global.ANALYTICS_INITIALIZED = true;
  }

  console.info(`Logging pageview for ${path}`);

  flow.push({ timestamp: Date.now(), path, isAuthenticated });

  if (current.environment === 'production' && !isAuthenticated) {
    ReactGA.pageview(path);
  }
};

export const submitFlow = () => {
  flow.push({ timestamp: Date.now() });

  if (flow.some((item) => item.isAuthenticated)) {
    return;
  }

  analytics.submitFlow(flow);
};

export default {
  initGoogleAnalytics,
  init,
  logPageView,
  submitFlow,
};

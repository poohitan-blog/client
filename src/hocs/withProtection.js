import React from 'react';

import { isAuthenticated } from 'services/session';

export default function withProtection(WrappedComponent) {
  class WithProtection extends React.Component {
    static async getInitialProps(context) {
      const wrappedComponentProps = WrappedComponent.getInitialProps
        ? await WrappedComponent.getInitialProps(context)
        : {};

      if (!isAuthenticated(context.req)) {
        return {
          error: {
            status: 401,
          },
        };
      }

      return wrappedComponentProps;
    }

    render() {
      return <WrappedComponent {...this.props} />; // eslint-disable-line
    }
  }

  return WithProtection;
}

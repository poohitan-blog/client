import React from 'react';
import PropTypes from 'prop-types';

import { Context as SessionContext, isAuthenticated as isUserAuthenticated } from '../services/session';
import API from '../services/api';
import { getAllCookies } from '../services/cookies';


export default function withSession(WrappedComponent) {
  class WithSession extends React.Component {
    static async getInitialProps(context) {
      const { req } = context;

      const isAuthenticated = isUserAuthenticated(req);

      const pages = isAuthenticated ? await API.pages.find(getAllCookies(req)) : null;
      const drafts = isAuthenticated ? await API.posts.find({ private: true }, getAllCookies(req)) : null;

      const wrappedComponentProps = WrappedComponent.getInitialProps
        ? await WrappedComponent.getInitialProps(context)
        : {};

      return {
        ...wrappedComponentProps,
        isAuthenticated,
        pages: pages ? pages.docs : [],
        drafts: drafts ? drafts.docs : [],
      };
    }

    render() {
      const {
        isAuthenticated,
        pages,
        drafts,
      } = this.props;

      return (
        <SessionContext.Provider value={{ isAuthenticated, pages, drafts }}>
          <WrappedComponent {...this.props} /> {/* eslint-disable-line */}
        </SessionContext.Provider>
      );
    }
  }

  WithSession.propTypes = {
    isAuthenticated: PropTypes.bool,
    pages: PropTypes.arrayOf(PropTypes.shape({})),
    drafts: PropTypes.arrayOf(PropTypes.shape({})),
  };

  WithSession.defaultProps = {
    isAuthenticated: false,
    pages: [],
    drafts: [],
  };

  return WithSession;
}

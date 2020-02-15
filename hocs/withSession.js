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

      const wrappedComponentProps = WrappedComponent.getInitialProps
        ? await WrappedComponent.getInitialProps(context)
        : {};

      if (!isAuthenticated) {
        return {
          ...wrappedComponentProps,
          isAuthenticated,
        };
      }

      const { docs: pages = [] } = await API.pages.find(getAllCookies(req));
      const { docs: drafts = [] } = await API.posts.find({ private: true }, getAllCookies(req));

      return {
        ...wrappedComponentProps,
        isAuthenticated,
        pages,
        drafts,
      };
    }

    render() {
      const {
        isAuthenticated,
        pages,
        drafts,
        ...rest
      } = this.props;

      return (
        <SessionContext.Provider value={{ isAuthenticated, pages, drafts }}>
          <WrappedComponent {...rest} /> {/* eslint-disable-line */}
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

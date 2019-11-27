import React from 'react';
import PropTypes from 'prop-types';
import Session from '../services/session';
import API from '../services/api';
import { getAllCookies } from '../services/cookies';

class AuthenticatablePage extends React.Component {
  static async getInitialProps({ req }) {
    const isAuthenticated = Session.isAuthenticated(req);
    const props = { isAuthenticated };

    if (isAuthenticated) {
      const pages = await API.pages.find(getAllCookies(req));
      const drafts = await API.posts.find({ private: true }, getAllCookies(req));

      props.pages = pages.docs;
      props.drafts = drafts.docs;
    }

    return props;
  }

  getChildContext() {
    const { pages, drafts, isAuthenticated } = this.props;

    return { isAuthenticated, pages, drafts };
  }
}

AuthenticatablePage.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  pages: PropTypes.arrayOf(PropTypes.object),
  drafts: PropTypes.arrayOf(PropTypes.object),
};

AuthenticatablePage.defaultProps = {
  pages: [],
  drafts: [],
};

AuthenticatablePage.childContextTypes = {
  isAuthenticated: PropTypes.bool,
  pages: PropTypes.arrayOf(PropTypes.object),
  drafts: PropTypes.arrayOf(PropTypes.object),
};

export default AuthenticatablePage;

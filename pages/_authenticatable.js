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
      const { docs } = await API.pages.find({}, getAllCookies(req));

      props.pages = docs;
    }

    return props;
  }

  getChildContext() {
    return { isAuthenticated: this.props.isAuthenticated, pages: this.props.pages };
  }
}

AuthenticatablePage.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  pages: PropTypes.arrayOf(PropTypes.object),
};

AuthenticatablePage.defaultProps = {
  pages: [],
};

AuthenticatablePage.childContextTypes = {
  isAuthenticated: PropTypes.bool,
  pages: PropTypes.arrayOf(PropTypes.object),
};

export default AuthenticatablePage;

import PropTypes from 'prop-types';
import Session from '../../services/session';
import API from '../../services/api';
import RedirectablePage from './redirectable';
import { getAllCookies } from '../../services/cookies';

class AuthenticatablePage extends RedirectablePage {
  static async getInitialProps({ req, res, asPath }) {
    const parentProps = await super.getInitialProps({ req, res, asPath });

    const isAuthenticated = Session.isAuthenticated(req);
    const props = { ...parentProps, isAuthenticated };

    if (isAuthenticated) {
      const pages = await API.pages.find(getAllCookies(req));
      const drafts = await API.posts.find({ private: true }, getAllCookies(req));

      props.pages = pages.docs;
      props.drafts = drafts.docs;
    }

    return props;
  }

  getChildContext() {
    return { isAuthenticated: this.props.isAuthenticated, pages: this.props.pages, drafts: this.props.drafts };
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

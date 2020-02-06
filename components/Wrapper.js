import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import NProgress from 'nprogress';
import lazyLoadBlurEffect from 'react-lazy-load-image-component/src/effects/blur.css';

import * as Analytics from '../services/analytics';
import { getPosition } from '../services/goodness-generator';
import { Context as SessionContext } from '../services/session';

import AdminPanel from './admin/Panel';
import LoginButton from './LoginButton';

import styles from '../styles/components/wrapper.scss';

NProgress.configure({ showSpinner: false });
Router.onRouteChangeStart = () => NProgress.start();
Router.onRouteChangeComplete = () => NProgress.done();
Router.onRouteChangeError = () => NProgress.done();

class Wrapper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.getGoodnessGeneratorClassName = this.getGoodnessGeneratorClassName.bind(this);
  }

  componentDidMount() {
    const { isAuthenticated } = this.context;

    if (!isAuthenticated) {
      Analytics.logPageView();
    }

    this.setState({
      goodnessGeneratorPosition: getPosition(),
    });
  }

  getGoodnessGeneratorClassName() {
    const { goodnessGeneratorPosition } = this.state;

    return goodnessGeneratorPosition
      ? `goodness-generator-on-${goodnessGeneratorPosition}`
      : '';
  }

  render() {
    const { pathname, children, className } = this.props;
    const goodnessGeneratorClassName = this.getGoodnessGeneratorClassName();

    const pathTokens = pathname
      .slice(1)
      .split('/')
      .filter((token) => token)
      .map((token) => `${token}-wrapper`);

    const classList = [styles.wrapper, ...pathTokens, className, goodnessGeneratorClassName];

    return (
      <SessionContext.Consumer>
        {({ isAuthenticated, pages, drafts }) => (
          <>
            <style>{lazyLoadBlurEffect}</style>
            <div id="wrapper" className={classList.join(' ')}>
              {
                children
              }
              {
                isAuthenticated && <AdminPanel pages={pages} drafts={drafts} />
              }
              {
                !isAuthenticated && <LoginButton />
              }
              <div className={styles.shadow} />
            </div>
          </>
        )}
      </SessionContext.Consumer>
    );
  }
}

Wrapper.propTypes = {
  children: PropTypes.node.isRequired,
  pathname: PropTypes.string,
  className: PropTypes.string,
};

Wrapper.defaultProps = {
  pathname: '',
  className: null,
};

export default Wrapper;

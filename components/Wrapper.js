import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import NProgress from 'nprogress';
import Head from 'next/head';
import Header from './Header';
import Content from './Content';
import styles from '../styles/base.scss';
import random from '../helpers/random';

NProgress.configure({ showSpinner: false });
Router.onRouteChangeStart = () => NProgress.start();
Router.onRouteChangeComplete = () => NProgress.done();
Router.onRouteChangeError = () => NProgress.done();

const LUCKY_NUMBER = { min: 1, max: 10 };

class Wrapper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      luckyNumber: random(LUCKY_NUMBER),
      usersNumber: random(LUCKY_NUMBER),
    };
  }

  render() {
    const userWonTheGame = this.state.luckyNumber === this.state.usersNumber;
    const raspberries = userWonTheGame ? <div className="raspberries" /> : null;

    return (
      <div className="wrapper">
        <Head>
          <style>{styles}</style>
        </Head>

        <Header trashBinState={this.props.trashBinState} />

        <Content>
          {this.props.children}
        </Content>

        <div className="wrapper-shadow" />

        {raspberries}
      </div>
    );
  }
}

Wrapper.propTypes = {
  children: PropTypes.node.isRequired,
  trashBinState: PropTypes.string.isRequired,
};

export default Wrapper;

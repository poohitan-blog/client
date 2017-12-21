import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Wrapper from './Wrapper';
import styles from '../styles/main.scss';

const Layout = props => (
  <div>
    <Head>
      <title>poohitan</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" key="viewport" />
      <meta httpEquiv="content-type" content="text/html; charset=utf-8" />
      <link rel="icon" href="/static/icons/favicon.ico" type="image/x-icon" />
      <style>{styles}</style>
    </Head>

    <Wrapper>
      {props.children}
    </Wrapper>
  </div>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;

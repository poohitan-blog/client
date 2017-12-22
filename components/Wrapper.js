import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Header from './Header';
import Content from './Content';
import styles from '../styles/base.scss';

const Wrapper = props => (
  <div className="wrapper">
    <Head>
      <style>{styles}</style>
    </Head>

    <Header />

    <Content>
      {props.children}
    </Content>

    <div className="wrapper-shadow" />
  </div>
);

Wrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Wrapper;

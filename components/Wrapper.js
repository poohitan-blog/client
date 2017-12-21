import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import Content from './Content';

const Wrapper = props => (
  <div className="wrapper">
    <Header />

    <Content>
      {props.children}
    </Content>
  </div>
);

Wrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Wrapper;

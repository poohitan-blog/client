import React from 'react';
import PropTypes from 'prop-types';

const Content = ({ children }) => (
  <section className="content">
    {children}
  </section>
);

Content.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Content;

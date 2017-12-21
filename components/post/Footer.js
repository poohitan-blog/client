import React from 'react';
import PropTypes from 'prop-types';
import * as Grammar from '../../services/grammar';

const Footer = props => (
  <div className="post-footer layout-row">
    <div className="post-footer-comments">{Grammar.describeCommentsCount(props.commentsCount)}</div>
    <div className="post-footer-date" />
    <div className="post-footer-tags" />
    <div className="post-footer-social" />
  </div>
);

Footer.propTypes = {
  commentsCount: PropTypes.number,
};

Footer.defaultProps = {
  commentsCount: 0,
};

export default Footer;

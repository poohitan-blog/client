import React from 'react';
import PropTypes from 'prop-types';
import * as Grammar from '../../services/grammar';
import CommentIcon from '../../static/icons/comment.svg';
import CalendarIcon from '../../static/icons/calendar.svg';

const Footer = props => (
  <div className="post-footer layout-row caption">
    <div className="post-footer-comments layout-row layout-align-start-center">
      <CommentIcon className="post-footer-icon post-footer-comments-icon" />
      <span className="flex-offset-5 nowrap">
        { Grammar.describeCommentsCount(props.commentsCount) }
      </span>
    </div>
    <div className="post-footer-date layout-row layout-align-start-center flex-offset-5">
      <CalendarIcon className="post-footer-icon post-footer-date-icon" />
      <span className="flex-offset-5 nowrap">{ Grammar.formatPostDate(props.date) }</span>
    </div>
    <div className="post-footer-tags" />
    <div className="post-footer-social" />
  </div>
);

Footer.propTypes = {
  commentsCount: PropTypes.number,
  date: PropTypes.instanceOf(Date).isRequired,
};

Footer.defaultProps = {
  commentsCount: 0,
};

export default Footer;

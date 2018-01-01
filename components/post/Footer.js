import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import * as Grammar from '../../services/grammar';
import CommentIcon from '../../static/icons/comment.svg';
import CalendarIcon from '../../static/icons/calendar.svg';

const Footer = (props) => {
  const tags = props.tags
    .map((tag) => {
      const encodedTag = encodeURIComponent(tag);

      return <Link key={tag} as={`/tag/${encodedTag}`} href={`/tag?tag=${encodedTag}`}><a>{tag}</a></Link>;
    })
    .reduce((previousTags, currentTag) => {
      if (!previousTags.length) {
        return [currentTag];
      }

      return [...previousTags, ', ', currentTag];
    }, []);
  const tagsMarkup = tags.length ? <span>Теґи: {tags}</span> : null;

  return (
    <div className="post-footer layout-row layout-align-xs-center-center smaller">
      <div className="post-footer-item post-footer-comments layout-row layout-align-start-center">
        <CommentIcon className="post-footer-icon post-footer-comments-icon" />
        <span className="flex-offset-5 nowrap">
          <Link as={`/p/${props.path}#comments`} href={{ pathname: '/post', query: { path: props.path }, href: '#comments' }}>
            <a>{ Grammar.describeCommentsCount(props.commentsCount) }</a>
          </Link>
        </span>
      </div>
      <div className="post-footer-item post-footer-date layout-row layout-align-start-center">
        <CalendarIcon className="post-footer-icon post-footer-date-icon" />
        <span className="flex-offset-5 nowrap">{ Grammar.formatPostDate(props.publishedAt) }</span>
      </div>
      <div className="post-footer-item post-footer-tags nowrap">{tagsMarkup}</div>
      <div className="post-footer-item post-footer-social" />
    </div>
  );
};

Footer.propTypes = {
  path: PropTypes.string.isRequired,
  commentsCount: PropTypes.number,
  publishedAt: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ]).isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
};

Footer.defaultProps = {
  commentsCount: 0,
};

export default Footer;

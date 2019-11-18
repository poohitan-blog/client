import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { formatPostDate, createWordCountDescriptor } from '../../services/grammar';
import CommentIcon from '../../public/static/icons/comment.svg';
import CalendarIcon from '../../public/static/icons/calendar.svg';

const describeCommentsCount = createWordCountDescriptor(['коментар', 'коментарі', 'коментарів']);

class Footer extends React.Component {
  render() {
    const {
      tags,
      path,
      commentsCount,
      publishedAt,
    } = this.props;

    const tagsMarkup = tags
      .map((tag) => {
        const encodedTag = encodeURIComponent(tag);

        return (
          <Link key={tag} as={`/tag/${encodedTag}`} href={`/tag?tag=${encodedTag}`}>
            <a title={`Записи із позначкою «${tag}»`}>{tag}</a>
          </Link>
        );
      })
      .reduce((previousTags, currentTag) => {
        if (!previousTags.length) {
          return [currentTag];
        }

        return [...previousTags, ', ', currentTag];
      }, []);

    return (
      <div className="post-footer layout-row layout-align-xs-center-center smaller">
        <div className="post-footer-item post-footer-comments layout-row layout-align-start-center">
          <CommentIcon className="post-footer-icon post-footer-comments-icon" />
          <span className="flex-offset-5 nowrap">
            <Link as={`/p/${path}#comments`} href={{ pathname: '/post', query: { path }, href: '#comments' }}>
              <a title="Коментарі до запису">{ describeCommentsCount(commentsCount) }</a>
            </Link>
          </span>
        </div>
        <div className="post-footer-item post-footer-date layout-row layout-align-start-center">
          <CalendarIcon className="post-footer-icon post-footer-date-icon" />
          <span className="flex-offset-5 nowrap">{ formatPostDate(publishedAt) }</span>
        </div>
        <div className="post-footer-item post-footer-tags nowrap">
          {
            tags.length ? <span>Позначки: {tagsMarkup}</span> : null
          }
        </div>
      </div>
    );
  }
}

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

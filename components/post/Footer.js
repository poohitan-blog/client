import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { formatPostDate, createWordCountDescriptor } from '../../services/grammar';
import CommentIcon from '../../public/static/icons/comment.svg';
import CalendarIcon from '../../public/static/icons/calendar.svg';

import styles from '../../styles/components/post/footer.scss';

const describeCommentsCount = createWordCountDescriptor(['коментар', 'коментарі', 'коментарів']);

class Footer extends React.Component {
  render() {
    const {
      tags,
      path,
      commentsCount,
      publishedAt,
      id,
    } = this.props;

    const tagsMarkup = tags
      .map((tag) => {
        const encodedTag = encodeURIComponent(tag);

        return (
          <Link key={tag} as={`/tag/${encodedTag}`} href="/tag/[name]">
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
      <div className={styles.wrapper} id={id}>
        <div className={styles.comments}>
          <CommentIcon className={styles.commentsIcon} />
          <Link as={`/p/${path}#comments`} href="/p/[slug]#comments">
            <a title="Коментарі до запису" className={styles.iconLabel}>{ describeCommentsCount(commentsCount) }</a>
          </Link>
        </div>
        <div className={styles.date}>
          <CalendarIcon className={styles.dateIcon} />
          <span
            className={styles.iconLabel}
            title={formatPostDate(publishedAt, { detailed: true })}
          >
            { formatPostDate(publishedAt) }
          </span>
        </div>
        <div className={styles.tags}>
          {
            tags.length ? (
              <>
                Позначки:
                {' '}
                {tagsMarkup}
              </>
            ) : null
          }
        </div>
      </div>
    );
  }
}

Footer.propTypes = {
  path: PropTypes.string.isRequired,
  commentsCount: PropTypes.number,
  publishedAt: PropTypes.instanceOf(Date).isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  id: PropTypes.string,
};

Footer.defaultProps = {
  commentsCount: 0,
  id: null,
};

export default Footer;

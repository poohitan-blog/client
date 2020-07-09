import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { formatPostDate, createWordCountDescriptor } from 'services/grammar';

import styles from 'styles/components/post/footer.module.scss';

const describeCommentsCount = createWordCountDescriptor(['коментар', 'коментарі', 'коментарів']);

class Footer extends React.Component {
  render() {
    const {
      tags,
      slug,
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
          <FontAwesomeIcon icon="comment-alt" className={styles.commentsIcon} />
          <Link as={`/p/${slug}#comments`} href="/p/[slug]#comments">
            <a title="Коментарі до запису" className={styles.iconLabel}>{ describeCommentsCount(commentsCount) }</a>
          </Link>
        </div>
        <div className={styles.date}>
          <FontAwesomeIcon icon="calendar-alt" className={styles.icon} />
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
  slug: PropTypes.string.isRequired,
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

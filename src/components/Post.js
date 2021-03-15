import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cc from 'classcat';

import FullBody from 'components/post/FullBody';
import CutBody from 'components/post/CutBody';
import Footer from 'components/post/Footer';
import TranslationButtons from 'components/post/TranslationButtons';
import AdminControlButtons from 'components/admin/ControlButtons';
import { DEFAULT_THUMBNAIL_WIDTH } from 'utils/html-processor/image';
import { Context as SessionContext } from 'services/session';

import styles from 'styles/components/post.module.scss';

const MathHighlighter = dynamic(() => import('components/ui/MathHighlighter'), { ssr: false, loading: () => null });

const Post = (props) => {
  const {
    title: originalPostTitle,
    body: originalPostBody,
    slug,
    cut,
    imagesWidth,
    language,
    translations,
    hidden,
    commentsCount,
    publishedAt,
    tags,
    className,
  } = props;

  const translation = translations.find((item) => item.lang === language) || {};
  const isTranslation = Boolean(translation.lang);

  const title = isTranslation ? translation.title : originalPostTitle;
  const body = isTranslation ? translation.body : originalPostBody;
  const link = isTranslation
    ? `/p/${slug}/${translation.lang}`
    : `/p/${slug}`;

  const fullClassName = cc({
    [styles.wrapper]: true,
    [className]: Boolean(className),
  });

  return (
    <article className={fullClassName} data-slug={slug} id={cut ? null : 'post'}>
      <h1 className={styles.title} id={cut ? null : 'post-title'}>
        <Link href={link}>
          <a title={title}>{title}</a>
        </Link>
        <SessionContext.Consumer>
          {({ isAuthenticated }) => {
            if (!hidden && !isAuthenticated) {
              return null;
            }

            return (
              <div className={styles.titleIcons}>
                {
                  hidden
                    ? <FontAwesomeIcon icon="eye-slash" className={styles.titleIcon} id={cut ? null : 'post-title-icon'} />
                    : null
                }
                {
                  isAuthenticated
                    ? (
                      <AdminControlButtons
                        entityType={isTranslation ? 'postTranslation' : 'post'}
                        tokens={[slug, translation.lang]}
                        className={styles.adminControlButtons}
                        id={cut ? null : 'post-admin-control-buttons'}
                      />
                    )
                    : null
                }
              </div>
            );
          }}
        </SessionContext.Consumer>
        {
          Boolean(translations.length)
            && (
              <TranslationButtons
                slug={slug}
                language={language}
                translations={translations}
              />
            )
        }
      </h1>
      <div className={styles.body} id={cut ? null : 'post-body'}>
        {
          cut
            ? <CutBody title={title} body={body} slug={slug} />
            : <FullBody language={language} body={body} imagesWidth={imagesWidth} />
        }
      </div>
      <MathHighlighter />
      <Footer
        slug={slug}
        commentsCount={commentsCount}
        publishedAt={new Date(publishedAt)}
        tags={tags}
        id={cut ? null : 'post-footer'}
      />
    </article>
  );
};

Post.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  cut: PropTypes.bool,
  hidden: PropTypes.bool,
  language: PropTypes.string,
  translations: PropTypes.arrayOf(PropTypes.object),
  commentsCount: PropTypes.number,
  imagesWidth: PropTypes.number,
  publishedAt: PropTypes.instanceOf(Date).isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  className: PropTypes.string,
};

Post.defaultProps = {
  cut: false,
  hidden: false,
  language: 'uk',
  translations: [],
  commentsCount: 0,
  imagesWidth: DEFAULT_THUMBNAIL_WIDTH,
  className: '',
};

export default Post;

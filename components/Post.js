import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import dynamic from 'next/dynamic';

import FullBody from './post/FullBody';
import CutBody from './post/CutBody';
import Footer from './post/Footer';
import TranslationButtons from './post/TranslationButtons';
import AdminControlButtons from './admin/ControlButtons';
import { LIGHTBOX_CLASS, DEFAULT_THUMBNAIL_WIDTH } from '../services/image-previews';
import { Context as SessionContext } from '../services/session';

import HiddenIcon from '../public/static/icons/hidden.svg';
import styles from '../styles/components/post.scss';

const Lightbox = dynamic(import('./ui/Lightbox'), { ssr: false, loading: () => null });
const SyntaxHighlighter = dynamic(import('./ui/SyntaxHighlighter'), { ssr: false, loading: () => null });
const MathHighlighter = dynamic(import('./ui/MathHighlighter'), { ssr: false, loading: () => null });

const Post = (props) => {
  const {
    title: originalPostTitle,
    body: originalPostBody,
    path,
    cut,
    imagesWidth,
    language,
    translations,
    private: hidden,
    commentsCount,
    publishedAt,
    tags,
  } = props;

  const translation = translations.find((item) => item.lang === language) || {};
  const isTranslation = Boolean(translation.lang);

  const title = isTranslation ? translation.title : originalPostTitle;
  const body = isTranslation ? translation.body : originalPostBody;
  const link = isTranslation
    ? { href: `/post?path=${path}&language=${translation.lang}`, as: `/p/${path}/${translation.lang}` }
    : { href: `/post?path=${path}`, as: `/p/${path}` };

  const lightboxImageSelector = `.${styles.wrapper}[data-path="${path}"] a.${LIGHTBOX_CLASS}`;

  return (
    <article className={styles.wrapper} data-path={path} id={cut ? null : 'post'}>
      <h1 className={styles.title} id={cut ? null : 'post-title'}>
        <Link as={link.as} href={link.href}>
          <a title={title} href={link.as}>{title}</a>
        </Link>
        {
          Boolean(translations.length)
            && (
              <TranslationButtons
                path={path}
                language={language}
                translations={translations}
              />
            )
        }
        <div className={styles.titleIcons}>
          {
            hidden && <div className={styles.titleIcon} id={cut ? null : 'post-title-icon'}><HiddenIcon /></div>
          }
          <SessionContext.Consumer>
            {({ isAuthenticated }) => isAuthenticated && (
              <AdminControlButtons
                attachedTo={isTranslation ? 'postTranslation' : 'post'}
                tokens={[path, translation.lang]}
                className={styles.adminControlButtons}
                id={cut ? null : 'post-admin-control-buttons'}
              />
            )}
          </SessionContext.Consumer>
        </div>
      </h1>
      <div className={styles.body} id={cut ? null : 'post-body'}>
        {
          cut
            ? <CutBody title={title} body={body} path={path} />
            : <FullBody language={language} body={body} imagesWidth={imagesWidth} />
        }
      </div>
      <Lightbox selector={lightboxImageSelector} />
      <SyntaxHighlighter />
      <MathHighlighter />
      <Footer
        path={path}
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
  path: PropTypes.string.isRequired,
  cut: PropTypes.bool,
  private: PropTypes.bool,
  language: PropTypes.string,
  translations: PropTypes.arrayOf(PropTypes.object),
  commentsCount: PropTypes.number,
  imagesWidth: PropTypes.number,
  publishedAt: PropTypes.instanceOf(Date).isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
};

Post.defaultProps = {
  cut: false,
  private: false,
  language: 'uk',
  translations: [],
  commentsCount: 0,
  imagesWidth: DEFAULT_THUMBNAIL_WIDTH,
};

export default Post;

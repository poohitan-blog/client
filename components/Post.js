import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import dynamic from 'next/dynamic';

import FullBody from './post/FullBody';
import CutBody from './post/CutBody';
import Footer from './post/Footer';
import AdminControlButtons from './admin/ControlButtons';
import { LIGHTBOX_CLASS } from '../services/image-previews';
import { translatePostIsAvailableInThisLanguage, getCountryCodeByLanguageCode } from '../services/translations';
import HiddenIcon from '../static/icons/hidden.svg';

const Lightbox = dynamic(import('./ui/Lightbox'), { ssr: false, loading: () => null });
const SyntaxHighlighter = dynamic(import('./ui/SyntaxHighlighter'), { ssr: false, loading: () => null });
const MathHighlighter = dynamic(import('./ui/MathHighlighter'), { ssr: false, loading: () => null });

const Post = (props, context) => {
  const {
    path,
    cut,
    language,
    translations,
  } = props;

  const translation = translations.find(item => item.lang === language);

  const title = translation ? translation.title : props.title;
  const body = translation ? translation.body : props.body;

  const bodyMarkup = cut
    ? <CutBody body={body} path={path} />
    : <FullBody body={body} />;

  const lightboxImageSelector = `.post[data-path="${path}"] .post-body a.${LIGHTBOX_CLASS}`;

  return (
    <article className="post post-complete" data-path={path}>
      <h1 className="post-title layout-row layout-align-start-start">
        <Link as={`/p/${path}`} href={`/post?path=${path}`} prefetch>
          <a>{title}</a>
        </Link>
        {
          context.isAuthenticated &&
          <div className="post-admin-control-buttons"><AdminControlButtons attachedTo="post" path={path} /></div>
        }
        {
          props.private && <div className="post-title-icon"><HiddenIcon /></div>
        }
        {
          translations.length
            ? (
              <div className="post-translations">
                {
                  translations
                    .filter(item => item.lang !== language)
                    .map(item => (
                      <Link
                        key={item.lang}
                        href={`/post?path=${path}&language=${item.lang}`}
                        as={`/p/${path}?language=${item.lang}`}
                      >
                        <a title={translatePostIsAvailableInThisLanguage(item.lang)}>
                          <div className={`post-translation flag-icon flag-icon-background flag-icon-${getCountryCodeByLanguageCode(item.lang)}`} />
                        </a>
                      </Link>
                    ))
                }
              </div>
            )
            : null
        }
      </h1>
      <div className="post-body">{bodyMarkup}</div>
      <Lightbox selector={lightboxImageSelector} />
      <SyntaxHighlighter />
      <MathHighlighter />
      <Footer {...props} />
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
};

Post.defaultProps = {
  cut: false,
  private: false,
  language: '',
  translations: [],
};

Post.contextTypes = {
  isAuthenticated: PropTypes.bool,
};

export default Post;

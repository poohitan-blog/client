import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

export const LIGHTBOX_CLASS = 'lightbox-image';
export const DEFAULT_THUMBNAIL_WIDTH = 800;

export function generateLazyPreview(node, { altLanguage = 'uk', scrollPosition, thumbnailWidth = DEFAULT_THUMBNAIL_WIDTH } = {}) {
  const {
    src: originalSource,
    alt,
    'data-averagecolor': averageColor,
    'data-originalwidth': originalWidth,
    'data-originalheight': originalHeight,
    'data-captionen': captionEn,
    'data-captionuk': captionUk,
  } = node.attribs;

  const placeholderSource = `${originalSource}?placeholder=true`;
  const thumbnailSource = `${originalSource}?width=${thumbnailWidth}`;

  const relativeThumbnailHeight = originalWidth && originalHeight
    ? (originalHeight * 100) / originalWidth
    : 60;

  const classList = ['lazy-load-image-wrapper'];

  const caption = altLanguage === 'uk' ? captionUk : captionEn;
  const alternativeText = alt || caption || captionEn;

  return (
    <a href={originalSource} className={LIGHTBOX_CLASS} key={originalSource}>
      <span className={classList.join(' ')}>
        <LazyLoadImage
          src={thumbnailSource}
          key={thumbnailSource}
          placeholderSrc={placeholderSource}
          alt={alternativeText}
          effect="blur"
          threshold={300}
          scrollPosition={scrollPosition}
          wrapperClassName="lazy-load-image"
        />
        <span
          className="lazy-load-image-placeholder"
          style={{ paddingTop: `${relativeThumbnailHeight}%`, backgroundColor: `#${averageColor}` }}
        />
      </span>
    </a>
  );
}

export default {
  generateLazyPreview,
  LIGHTBOX_CLASS,
};

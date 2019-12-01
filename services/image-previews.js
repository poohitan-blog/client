import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

export const LIGHTBOX_CLASS = 'lightbox-image';
export const DEFAULT_THUMBNAIL_WIDTH = 800;

export function generateLazyPreview(node, { scrollPosition, thumbnailWidth = DEFAULT_THUMBNAIL_WIDTH } = {}) {
  const {
    src: originalSource,
    alt,
    'data-averagecolor': averageColor,
    'data-originalwidth': originalWidth,
    'data-originalheight': originalHeight,
  } = node.attribs;

  const placeholderSource = `${originalSource}?placeholder=true`;
  const thumbnailSource = `${originalSource}?width=${thumbnailWidth}`;

  const relativeThumbnailHeight = (originalHeight * 100) / originalWidth;

  const classList = ['lazy-load-image-wrapper'];

  if (!relativeThumbnailHeight) {
    classList.push('lazy-load-image-wrapper-unknown-height');
  }

  return (
    <a href={originalSource} className={LIGHTBOX_CLASS} key={originalSource}>
      <span className={classList.join(' ')}>
        <LazyLoadImage
          src={thumbnailSource}
          key={thumbnailSource}
          placeholderSrc={placeholderSource}
          alt={alt}
          effect="blur"
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

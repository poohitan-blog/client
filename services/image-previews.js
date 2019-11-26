import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

export const LIGHTBOX_CLASS = 'lightbox-image';

const THUMBNAIL_WIDTH = 800;

export function generateLazyPreview(node, scrollPosition) {
  const {
    src: originalSource,
    alt,
    'data-averagecolor': averageColor,
    'data-originalwidth': originalWidth,
    'data-originalheight': originalHeight,
  } = node.attribs;

  const placeholderSource = `${originalSource}?placeholder=true`;
  const thumbnailSource = `${originalSource}?width=${THUMBNAIL_WIDTH}`;

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

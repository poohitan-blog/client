import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

export const LIGHTBOX_CLASS = 'lightbox-image';
export const PREVIEW_PARAM = ':preview';

export function generateLazyPreview(node, scrollPosition) {
  const { src } = node.attribs;
  const previewSrc = `${src}${PREVIEW_PARAM}`;

  return (
    <a href={src} className={LIGHTBOX_CLASS} key={src}>
      <LazyLoadImage
        src={src}
        threshold="200"
        placeholderSrc={previewSrc}
        scrollPosition={scrollPosition}
        effect="blur"
        wrapperClassName="lazy-load-image-wrapper"
      />
    </a>
  );
}

export default {
  generateLazyPreview,
  PREVIEW_PARAM,
  LIGHTBOX_CLASS,
};

import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

export const LIGHTBOX_CLASS = 'lightbox-image';
export const DEFAULT_THUMBNAIL_WIDTH = 800;
const DEFAULT_THUMBNAIL_RELATIVE_HEIGHT = 60;

function calculateRelativeThumbnailHeight(node) {
  const {
    'data-originalwidth': originalWidth,
    'data-originalheight': originalHeight,
  } = node.attribs;

  return originalWidth && originalHeight
    ? (originalHeight * 100) / originalWidth
    : DEFAULT_THUMBNAIL_RELATIVE_HEIGHT;
}
function generateAltText(node, language) {
  const {
    alt,
    'data-captionen': captionEn,
    'data-captionuk': captionUk,
  } = node.attribs;

  const captionByAI = language === 'uk'
    ? captionUk
    : captionEn;
  const captionInfo = language === 'uk'
    ? '(на думку штучного інтелекту)'
    : '(description by AI)';
  const caption = captionByAI
    ? `${captionByAI} ${captionInfo}`
    : '';

  return alt || caption;
}

function generateLinkTitle(node, language) {
  const alt = generateAltText(node, language);
  const clickToEnlarge = language === 'uk' ? 'Клацніть, шоб збільшити' : 'Click to enlarge';

  return alt ? `${alt}. ${clickToEnlarge}.` : clickToEnlarge;
}

export function generateLazyPreview(node, { altLanguage = 'uk', scrollPosition, thumbnailWidth = DEFAULT_THUMBNAIL_WIDTH } = {}) {
  const {
    src: originalSource,
    'data-averagecolor': averageColor,
  } = node.attribs;

  const placeholderSource = `${originalSource}?placeholder=true`;
  const thumbnailSource = `${originalSource}?width=${thumbnailWidth}`;

  const relativeThumbnailHeight = calculateRelativeThumbnailHeight(node);
  const alt = generateAltText(node, altLanguage);
  const title = generateLinkTitle(node, altLanguage);

  const classList = ['lazy-load-image-wrapper'];

  return (
    <a href={originalSource} className={LIGHTBOX_CLASS} key={originalSource} title={title}>
      <span className={classList.join(' ')}>
        <LazyLoadImage
          src={thumbnailSource}
          key={thumbnailSource}
          placeholderSrc={placeholderSource}
          alt={alt}
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

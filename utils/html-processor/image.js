import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

export const LIGHTBOX_CLASS = 'lightbox-image';
export const DEFAULT_THUMBNAIL_WIDTH = 800;
const DEFAULT_THUMBNAIL_RELATIVE_HEIGHT = 60;
const DEFAULT_ALT_LANGUAGE = 'uk';

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
  const separator = alt.slice(-1) === '.' ? '' : '.';
  const clickToEnlarge = language === 'uk' ? 'Клацни, шоб збільшити' : 'Click to enlarge';

  return alt ? `${alt}${separator} ${clickToEnlarge}.` : clickToEnlarge;
}

export function generateLazyPreview(node, {
  altLanguage = DEFAULT_ALT_LANGUAGE,
  thumbnailWidth = DEFAULT_THUMBNAIL_WIDTH,
  scrollPosition,
}) {
  const {
    class: className,
    src: originalSource,
    'data-averagecolor': averageColor,
    'data-clickable': clickable,
  } = node.attribs;

  const placeholderSource = `${originalSource}?placeholder=true`;
  const thumbnailSource = `${originalSource}?width=${thumbnailWidth}`;

  const relativeThumbnailHeight = calculateRelativeThumbnailHeight(node);
  const alt = generateAltText(node, altLanguage);
  const title = generateLinkTitle(node, altLanguage);

  const isClickable = clickable !== 'false';

  const image = (
    <span className="lazy-load-image-wrapper">
      <LazyLoadImage
        src={thumbnailSource}
        key={thumbnailSource}
        placeholderSrc={placeholderSource}
        alt={alt}
        effect="blur"
        threshold={300}
        scrollPosition={scrollPosition}
        wrapperClassName="lazy-load-image"
        className={className}
      />
      <span
        className="lazy-load-image-placeholder"
        style={{ paddingTop: `${relativeThumbnailHeight}%`, backgroundColor: `#${averageColor}` }}
      />
    </span>
  );

  return isClickable
    ? (
      <a href={originalSource} className={`expendable-widget ${LIGHTBOX_CLASS}`} key={originalSource} title={title}>
        {image}
      </a>
    )
    : image;
}

export default function processImage({ language, imagesWidth, scrollPosition } = {}) {
  const { node } = this;
  const { name, type } = node;
  const isImage = type === 'tag' && name === 'img';

  if (isImage) {
    this.processedNode = generateLazyPreview(node, {
      altLanguage: language,
      thumbnailWidth: imagesWidth,
      scrollPosition,
    });
  }

  return this;
}

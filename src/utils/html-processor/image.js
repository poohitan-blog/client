import React from 'react';
import Image from 'next/image';

import styles from 'styles/image.module.scss';

export const LIGHTBOX_CLASS = 'lightbox-image';
const LIGHTBOX_IMAGE_CAPTION_CLASS = 'lightbox-image-caption';

export const DEFAULT_THUMBNAIL_WIDTH = 800;
const DEFAULT_ALT_LANGUAGE = 'uk';

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
}) {
  const {
    class: className,
    src: originalSource,
    'data-averagecolor': averageColor,
    'data-clickable': clickable,
    'data-originalwidth': originalWidth,
    'data-originalheight': originalHeight,
  } = node.attribs;

  const placeholderSource = `${originalSource}?placeholder=true`;

  const alt = generateAltText(node, altLanguage);
  const title = generateLinkTitle(node, altLanguage);

  const thumbnailHeight = thumbnailWidth / (originalWidth / originalHeight);

  const isClickable = clickable !== 'false';

  const loader = ({ src, width }) => `${src}?width=${width}`;

  const image = (
    <div className={[className, styles.wrapper].join(' ')} style={{ backgroundColor: `#${averageColor}` }}>
      <img
        src={placeholderSource}
        alt={alt}
        aria-hidden="true"
        className={styles.placeholder}
      />
      <Image
        src={originalSource}
        alt={alt}
        width={thumbnailWidth}
        height={thumbnailHeight}
        loader={loader}
      />
    </div>
  );

  const captionHtml = alt ? `<span class="${LIGHTBOX_IMAGE_CAPTION_CLASS}">${alt}</span>` : null;

  return isClickable
    ? (
      <a
        title={title}
        href={originalSource}
        data-src={originalSource}
        data-sub-html={captionHtml}
        className={`expendable-widget ${LIGHTBOX_CLASS}`}
        key={originalSource}
      >
        {image}
      </a>
    )
    : image;
}

export default function processImage({ language, imagesWidth } = {}) {
  const { node } = this;
  const { name, type } = node;
  const isImage = type === 'tag' && name === 'img';

  if (isImage) {
    this.processedNode = generateLazyPreview(node, {
      altLanguage: language,
      thumbnailWidth: imagesWidth,
    });
  }

  return this;
}

import React from 'react';
import Image from 'next/image';

import styles from 'styles/image.module.scss';

export const LIGHTBOX_CLASS = 'lightbox-image';
const LIGHTBOX_IMAGE_CAPTION_CLASS = 'lightbox-image-caption';

export const DEFAULT_THUMBNAIL_WIDTH = 640;
const DEFAULT_ALT_LANGUAGE = 'uk';

function generateCaption(node, language) {
  const {
    alt,
    'data-captionen': captionEn,
    'data-captionuk': captionUk,
  } = node.attribs;

  if (alt) {
    return {
      text: alt,
      comment: '',
    };
  }

  const captionByAI = language === 'uk'
    ? captionUk
    : captionEn;
  const captionInfo = language === 'uk'
    ? '(опис згенеровано штучним інтелектом)'
    : '(description by AI)';

  return {
    text: captionByAI,
    comment: captionInfo,
  };
}

function generateLinkTitle(node, language) {
  const { text } = generateCaption(node, language);

  const separator = text?.slice(-1) === '.' ? '' : '.';
  const clickToEnlarge = language === 'uk' ? 'Клацни, шоб збільшити' : 'Click to enlarge';

  return text ? `${text}${separator} ${clickToEnlarge}.` : clickToEnlarge;
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

  const caption = generateCaption(node, altLanguage);
  const title = generateLinkTitle(node, altLanguage);

  const thumbnailHeight = thumbnailWidth / (originalWidth / originalHeight);

  const isClickable = clickable !== 'false';

  const image = (
    <div className={[className, styles.wrapper].join(' ')} style={{ backgroundColor: `#${averageColor}` }}>
      <img
        src={placeholderSource}
        alt={caption.text}
        aria-hidden="true"
        className={styles.placeholder}
      />
      <Image
        src={originalSource}
        alt={caption.text}
        width={thumbnailWidth}
        height={thumbnailHeight}
      />
    </div>
  );

  const captionHtml = caption.text
    ? `<span class="${LIGHTBOX_IMAGE_CAPTION_CLASS}">${caption.text} <em>${caption.comment}</em></span>`
    : null;

  return isClickable
    ? (
      <div
        title={title}
        href={originalSource}
        data-src={originalSource}
        data-sub-html={captionHtml}
        className={`expendable-widget ${LIGHTBOX_CLASS}`}
      >
        {image}
      </div>
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

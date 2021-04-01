import React from 'react';
import LazyLoad from 'react-lazyload';

import Iframe from 'components/ui/Iframe';

export default function processIframe() {
  const {
    type, name, attribs,
  } = this.node;
  const isIframe = type === 'tag' && name === 'iframe';

  if (isIframe) {
    const {
      src,
      height,
      referrerpolicy: referrerPolicy,
      class: className,
    } = attribs;

    const allowFullScreen = attribs.allowfullscreen || attribs.allowfullscreen === '';

    this.processedNode = (
      <LazyLoad offset={300}>
        <Iframe
          src={src}
          height={height}
          allowFullScreen={allowFullScreen}
          referrerPolicy={referrerPolicy}
          className={className}
        />
      </LazyLoad>
    );
  }

  return this;
}

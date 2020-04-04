import React from 'react';
import { LazyLoadComponent } from 'react-lazy-load-image-component';

import Iframe from '../../components/ui/Iframe';

export default function processIframe() {
  const {
    type, name, attribs,
  } = this.node;
  const isIframe = type === 'tag' && name === 'iframe';

  if (isIframe) {
    const {
      src,
      height,
      allowfullscreen: allowFullScreen,
      referrerpolicy: referrerPolicy,
      class: className,
    } = attribs;

    this.processedNode = (
      <LazyLoadComponent threshold={300}>
        <Iframe
          src={src}
          height={height}
          allowFullScreen={allowFullScreen}
          referrerPolicy={referrerPolicy}
          className={className}
        />
      </LazyLoadComponent>
    );
  }

  return this;
}

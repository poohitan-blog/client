import React from 'react';
import Link from 'next/link';
import { domToReact } from 'html-react-parser';
import { current } from '../config';

import { generateLazyPreview } from '../services/image-previews';

export default class HTMLProcessor {
  constructor(node) {
    this.node = node;
    this.processedNode = null;
  }

  getNode() {
    return this.processedNode;
  }

  asImage({ language, imagesWidth, scrollPosition } = {}) {
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

  asLink() {
    const { node } = this;
    const {
      name,
      type,
      attribs = {},
      children,
    } = node;
    const isLink = type === 'tag' && name === 'a';

    if (isLink) {
      const isRelativeLink = attribs.href && attribs.href[0] === '/';
      const isSelfLink = attribs.href.indexOf(current.clientURL) === 0;

      const href = isSelfLink ? attribs.href.replace(current.clientURL, '') : attribs.href;

      if (isRelativeLink || isSelfLink) {
        this.processedNode = (
          <Link href={href}><a>{domToReact(children)}</a></Link>
        );
      }
    }

    return this;
  }

  asCut() {
    const isCut = this.node.type === 'tag' && this.node.name === 'cut';

    if (isCut) {
      this.processedNode = <span id="cut" />;
    }

    return this;
  }
}

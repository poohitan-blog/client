import React from 'react';
import Link from 'next/link';
import { domToReact } from 'html-react-parser';
import { current } from '../config';

import { generateLazyPreview } from '../services/image-previews';
import getRouteByURL from '../helpers/get-route-by-url';

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
    const { href: url } = attribs;
    const isLink = type === 'tag' && name === 'a' && url;

    if (isLink) {
      const isRelativeLink = url[0] === '/';
      const isSelfLink = url.indexOf(current.clientURL) === 0;

      if (isRelativeLink || isSelfLink) {
        const relativeURL = isSelfLink ? url.replace(current.clientURL, '') : url;
        const route = getRouteByURL(relativeURL);

        console.log(relativeURL, route);

        this.processedNode = (
          <Link as={relativeURL} href={route}>
            <a>{domToReact(children)}</a>
          </Link>
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

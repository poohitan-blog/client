import React from 'react';

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
    const isImage = this.node.type === 'tag' && this.node.name === 'img';

    if (isImage) {
      this.processedNode = generateLazyPreview(this.node, {
        altLanguage: language,
        thumbnailWidth: imagesWidth,
        scrollPosition,
      });
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

import processAsImage from 'utils/html-processor/image';
import processAsLink from 'utils/html-processor/link';
import processAsCut from 'utils/html-processor/cut';
import processAsCode from 'utils/html-processor/code';
import processAsIframe from 'utils/html-processor/iframe';
import processAsMath from 'utils/html-processor/math';

export default class HTMLProcessor {
  constructor(node) {
    this.node = node;
    this.processedNode = null;
  }

  getNode() {
    return this.processedNode;
  }

  asImage(...params) {
    return processAsImage.call(this, ...params);
  }

  asLink(...params) {
    return processAsLink.call(this, ...params);
  }

  asCode(...params) {
    return processAsCode.call(this, ...params);
  }

  asCut(...params) {
    return processAsCut.call(this, ...params);
  }

  asIframe(...params) {
    return processAsIframe.call(this, ...params);
  }

  asMath(...params) {
    return processAsMath.call(this, ...params);
  }
}

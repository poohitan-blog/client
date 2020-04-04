import processAsImage from './html-processor/image';
import processAsLink from './html-processor/link';
import processAsCut from './html-processor/cut';
import processAsCode from './html-processor/code';
import processAsIframe from './html-processor/iframe';

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
}

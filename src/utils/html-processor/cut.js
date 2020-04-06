import React from 'react';

export default function processCut() {
  const { type, name } = this.node;
  const isCut = type === 'tag' && name === 'cut';

  if (isCut) {
    this.processedNode = <span id="cut" />;
  }

  return this;
}

import React from 'react';
import MathJax from 'react-mathjax';

export default function processMath() {
  const { name, type, children } = this.node;
  const isMath = type === 'tag' && name === 'math';

  if (isMath) {
    const [child] = children;
    const formula = child.data;

    this.processedNode = (
      <MathJax.Provider>
        <MathJax.Node inline formula={formula} />
      </MathJax.Provider>
    );
  }

  return this;
}

// Warning: this component can be used client-side only
// Import it using dynamic import with "ssr: false"

import React from 'react';

import Highlighter from 'highlight.js';

class SyntaxHighlighter extends React.Component {
  componentDidMount() {
    $('pre').each((i, block) => {
      Highlighter.highlightBlock(block);
    });
  }

  render() {
    return null;
  }
}

export default SyntaxHighlighter;

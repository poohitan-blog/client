// Warning: this component can be used client-side only
// Import it using dynamic import with "ssr: false"

import React from 'react';

import Highlighter from 'highlight.js';
import styles from 'highlight.js/styles/monokai-sublime.css';

class SyntaxHighlighter extends React.Component {
  componentDidMount() {
    $('pre').each((i, block) => {
      Highlighter.highlightBlock(block);
    });
  }

  render() {
    return <style>{styles}</style>;
  }
}

export default SyntaxHighlighter;

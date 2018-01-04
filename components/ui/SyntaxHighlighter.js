// Warning: this component can be used client-side only
// Import it using dynamic import with "ssr: false"

import React from 'react';
import styles from '../../static/libs/highlight/monokai-sublime.css';

const Highlighter = require('../../static/libs/highlight/highlight.min');

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

// Warning: this component can be used client-side only
// Import it using dynamic import with "ssr: false"

import React from 'react';

class MathHighlighter extends React.Component {
  componentDidMount() {
    const MathJax = global.MathJax;

    if (!MathJax) {
      return;
    }

    MathJax.Hub.Queue(['Typeset', global.MathJax.Hub]);
  }

  render() {
    return null;
  }
}

export default MathHighlighter;

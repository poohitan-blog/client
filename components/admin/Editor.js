// Warning: this component can be used client-side only
// Import it using dynamic import with "ssr: false"

import React from 'react';
import PropTypes from 'prop-types';

import styles from '../../static/libs/jodit/jodit.min.css';

import YoutubeButton from './editor/buttons/youtube';
import CutButton from './editor/buttons/cut';
import QuoteButton from './editor/buttons/quote';
import UploaderPlugin from './editor/plugins/uploader';

import Localization from './editor/localization';

const Jodit = require('../../static/libs/jodit/jodit.min.js');

const buttons = [
  'bold', 'italic', '|',
  'paragraph', 'align',
  'ul', 'ol', 'brush', '|',
  'image',
  YoutubeButton,
  QuoteButton,
  'link', 'hr', '|',
  'fullsize', 'source',
  CutButton,

];

class Editor extends React.Component {
  componentDidMount() {
    Jodit.lang.uk = Localization;
    const editor = new Jodit('.editor', {
      buttons,
      sizeLG: 100,
      minHeight: 200,
      height: 350,
      width: '100%',
      placeholder: 'Жили-були дід і бабця…',
      language: 'uk',
      uploader: UploaderPlugin,
    });

    editor.setEditorValue(this.props.html);

    editor.events.on('change', (oldContent, newContent) => this.props.onChange(newContent));
  }

  render() {
    return (
      <div className="editor-wrapper">
        <style>{styles}</style>
        <div className="editor" />
      </div>
    );
  }
}

Editor.propTypes = {
  html: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

Editor.defaultProps = {
  html: '<p></p>',
};

export default Editor;

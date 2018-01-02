// Warning: this component can be used client-side only
// Import it using dynamic import with "ssr: false"

import React from 'react';
import PropTypes from 'prop-types';

import config from '../../config';
import styles from '../../static/libs/jodit/jodit.min.css';

import YoutubeButton from './editor/youtube-button';
import CutButton from './editor/cut-button';

const Jodit = require('../../static/libs/jodit/jodit.min.js');

const buttons = [
  'bold', 'italic', '|',
  'paragraph', 'align',
  'ul', 'ol', '|',
  'brush', '|',
  'image',
  YoutubeButton,
  'table', 'link', '|',
  'hr', 'fullsize', 'source',
  CutButton,
];

class Editor extends React.Component {
  componentDidMount() {
    const editor = new Jodit('.editor', {
      buttons,
      sizeLG: 100,
      minHeight: 200,
      height: 350,
      width: '100%',
      placeholder: 'Жили-були дід і бабця…',
      cleanHTML: {
        allowTags: {
          p: true,
          strong: true,
          b: true,
          em: true,
          i: true,
          blockquote: true,
          div: true,
          cut: true,
          a: true,
          table: true,
          tr: true,
          td: true,
          img: true,
          iframe: {
            src: true, allowfullscreen: true, frameborder: true,
          },
        },
        cleanOnPaste: true,
      },
      uploader: {
        url: `${config.current.apiURL}/images`,
        prepareData(formData) {
          const file = formData.get('files[0]');

          formData.append('images', file);
          formData.delete('files[0]');
        },
        isSuccess(response) {
          return response.length;
        },
        process(images) {
          images.forEach(image => this.jodit.selection.insertImage(image));
        },
      },
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

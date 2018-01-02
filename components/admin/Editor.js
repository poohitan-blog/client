import React from 'react';
import PropTypes from 'prop-types';

import config from '../../config';
import styles from '../../static/libs/jodit/jodit.min.css';
import '../../static/libs/jodit/jodit.min';

// Warning: this component can be used client-side only
// Import it using dynamic import with "ssr: false"

const buttons = [
  'bold', 'italic', '|',
  'paragraph', 'align',
  'ul', 'ol', '|',
  'brush', '|',
  'image', 'video', 'table', 'link', '|',
  'hr', 'fullsize', 'source',
  {
    name: 'cut',
    tooltip: 'Cut',
    exec(editor) {
      const hasCutAlready = editor.getEditorValue().includes('<cut>');

      if (hasCutAlready) {
        return;
      }

      editor.selection.insertHTML('<cut></cut>');
    },
  },
];

class Editor extends React.Component {
  componentDidMount() {
    const editor = new global.Jodit('.editor', {
      buttons,
      sizeLG: 100,
      minHeight: 200,
      height: 350,
      width: '100%',
      placeholder: 'Жили-були дід і бабця…',
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

import React from 'react';
import PropTypes from 'prop-types';

import styles from '../static/libs/jodit/jodit.min.css';
import '../static/libs/jodit/jodit.min';

// Warning: this component can be used client-side only
// Import it using dynamic import with "ssr: false"

class Editor extends React.Component {
  componentDidMount() {
    const editor = new global.Jodit('.editor', {
      minHeight: 200,
      height: 350,
      width: '100%',
      placeholder: 'Жили-були дід і бабця…',
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

// Warning: this component can be used client-side only
// Import it using dynamic import with "ssr: false"

import React from 'react';
import PropTypes from 'prop-types';
import { Controlled as CodeMirror } from 'react-codemirror2';

import styles from '../../styles/components/admin/code-editor.module.scss';

import 'codemirror/mode/sass/sass';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/mode/clike/clike';

const MODE_BY_LANGUAGE = {
  css: 'sass',
  sass: 'sass',
  scss: 'sass',
  js: 'javascript',
  javascript: 'javascript',
  jsx: 'jsx',
  c: 'clike',
  cpp: 'clike',
  csh: 'clike',
  csharp: 'clike',
  'c#': 'clike',
  'c++': 'clike',
};

const DEFAULT_MODE = 'javascript';

const CodeEditor = ({
  value,
  language,
  theme,
  readonly,
  onInput,
  className,
}) => {
  const classList = [className, styles.wrapper];

  if (!value) {
    classList.push(styles.collapsed);
  }

  if (readonly) {
    classList.push(styles.readonly);
  }

  const mode = MODE_BY_LANGUAGE[language.toLowerCase()] || DEFAULT_MODE;

  return (
    <CodeMirror
      value={value}
      options={{
        mode,
        theme,
        readOnly: readonly,
        lineNumbers: true,
      }}
      onBeforeChange={(editor, data, newValue) => onInput(newValue)}
      className={classList.join(' ')}
    />
  );
};

CodeEditor.propTypes = {
  value: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  readonly: PropTypes.bool,
  theme: PropTypes.string,
  onInput: PropTypes.func,
  className: PropTypes.string,
};

CodeEditor.defaultProps = {
  readonly: false,
  theme: 'eclipse',
  onInput: () => {},
  className: null,
};

export default CodeEditor;

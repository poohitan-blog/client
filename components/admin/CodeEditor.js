import React from 'react';
import PropTypes from 'prop-types';
import { Controlled as CodeMirror } from 'react-codemirror2';

import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/mode/css/css';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/shell/shell';

import 'codemirror/addon/selection/active-line';

import styles from '../../styles/components/admin/code-editor.module.scss';

const MIME_BY_LANGUAGE = new Proxy({
  css: 'text/css',
  scss: 'text/x-scss',

  js: 'text/javascript',
  javascript: 'text/javascript',
  jsx: 'text/jsx',

  ts: 'text/typescript',
  typescript: 'text/typescript',
  tsx: 'text/typescript-jsx',

  html: 'text/html',
  xml: 'application/xml',

  json: 'application/json',

  c: 'text/x-csrc',
  cpp: 'text/x-c++src',

  'c++': 'text/x-c++src',
  csh: 'text/x-csharp',
  csharp: 'text/x-csharp',
  'c#': 'text/x-csharp',

  objc: 'text/x-objectivec',
  objectivec: 'text/x-objectivec',

  scala: 'text/x-scala',

  java: 'text/x-java',

  bash: 'text/x-sh',
  zsh: 'text/x-sh',
}, {
  get(target, name = '') {
    const nameLowerCase = name.toLowerCase();

    return target[nameLowerCase] || null;
  },
});

const CodeEditor = ({
  value,
  language,
  theme,
  readonly,
  onInput,
  className,
}) => {
  const classList = [styles.wrapper, className, 'expendable-widget'];

  if (!value) {
    classList.push(styles.collapsed);
  }

  if (readonly) {
    classList.push(styles.readonly);
  }

  const mode = MIME_BY_LANGUAGE[language];

  return (
    <CodeMirror
      value={value}
      options={{
        mode,
        theme,
        readOnly: readonly,
        styleActiveLine: !readonly,
        lineNumbers: true,
        cursorHeight: 0.7,
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

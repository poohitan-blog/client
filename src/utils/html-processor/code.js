import React from 'react';
import CodeEditor from 'utils/code-editor';

export default function processCode() {
  const {
    name,
    type,
    children,
    attribs = {},
  } = this.node;

  const isCode = type === 'tag' && name === 'pre';
  const language = attribs['data-language'] || attribs.class;

  if (isCode) {
    const code = children[0].data;

    this.processedNode = (
      <CodeEditor
        value={code}
        language={language}
        theme="monokai"
        readonly
      />
    );
  }

  return this;
}

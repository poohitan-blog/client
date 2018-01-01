import React from 'react';
import dynamic from 'next/dynamic';

const Editor = dynamic(import('../components/Editor'), { // eslint-disable-line
  ssr: false,
  loading: () => <p className="text-center fatty">Завантажується…</p>,
});

export default Editor;

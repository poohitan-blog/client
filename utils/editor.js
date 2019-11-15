import React from 'react';
import dynamic from 'next/dynamic';
import LoaderIcon from '../public/static/icons/three-dots.svg';

const Editor = dynamic(import('../components/admin/Editor'), {
  ssr: false,
  loading: () => <p className="text-center fatty"><LoaderIcon className="editor-loader-icon" /></p>,
});

export default Editor;

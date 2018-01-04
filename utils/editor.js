import React from 'react';
import dynamic from 'next/dynamic';

const Editor = dynamic(import('../components/admin/Editor'), {
  ssr: false,
  loading: () => <p className="text-center fatty">Завантажується…</p>,
});

export default Editor;

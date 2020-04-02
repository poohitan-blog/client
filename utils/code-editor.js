import React from 'react';
import dynamic from 'next/dynamic';

import { Circle } from '../components/ui/Loader';

const CodeEditor = dynamic(() => import('../components/admin/CodeEditor'), {
  ssr: false,
  loading: () => <div className="text-center fatty"><Circle /></div>,
});

export default CodeEditor;

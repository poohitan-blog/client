import React from 'react';
import dynamic from 'next/dynamic';

import { Circle } from 'components/ui/Loader';

const Editor = dynamic(() => import('components/admin/Editor'), {
  ssr: false,
  loading: () => <div className="text-center fatty"><Circle /></div>,
});

export default Editor;

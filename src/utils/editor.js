import React from 'react';
import dynamic from 'next/dynamic';

import { Circle } from 'Components/ui/Loader';

const Editor = dynamic(() => import('Components/admin/Editor'), {
  ssr: false,
  loading: () => <div className="text-center fatty"><Circle /></div>,
});

export default Editor;

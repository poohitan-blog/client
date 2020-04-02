import React from 'react';
import dynamic from 'next/dynamic';

import LoaderIcon from '../public/static/icons/three-dots.svg';
import styles from '../styles/components/admin/code-editor.module.scss';

const CodeEditor = dynamic(() => import('../components/admin/CodeEditor'), {
  ssr: false,
  loading: () => (
    <p className="text-center fatty">
      <LoaderIcon className={styles.loader} />
    </p>
  ),
});

export default CodeEditor;

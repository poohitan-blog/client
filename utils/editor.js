import React from 'react';
import dynamic from 'next/dynamic';
import LoaderIcon from '../public/static/icons/three-dots.svg';
import styles from '../styles/components/admin/editor.module.scss';

const Editor = dynamic(() => import('../components/admin/Editor'), {
  ssr: false,
  loading: () => (
    <p className="text-center fatty">
      <LoaderIcon className={styles.loader} />
    </p>
  ),
});

export default Editor;

import React from 'react';

import Wrapper from 'components/Wrapper';
import Header from 'components/Header';
import Content from 'components/Content';
import { Dots } from 'components/ui/Loader';

import styles from 'styles/components/page-fallback.module.scss';

function PageFallback() {
  return (
    <Wrapper>
      <Header />
      <Content>
        <div className={styles.loaderWrapper}>
          <Dots />
        </div>
      </Content>
    </Wrapper>
  );
}

export default PageFallback;

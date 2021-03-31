import React from 'react';
import { NextSeo } from 'next-seo';

import Wrapper from 'components/Wrapper';
import Header from 'components/Header';
import Content from 'components/Content';
import UploadFilesForm from 'components/admin/UploadFilesForm';

import checkAdminAccess from 'utils/check-admin-access';

function UploadFiles() {
  const title = 'Завантажити файли';

  return (
    <Wrapper>
      <NextSeo title={title} />
      <Header />
      <Content>
        <UploadFilesForm title={title} />
      </Content>
    </Wrapper>
  );
}

export async function getServerSideProps({ req }) {
  const hasAccess = await checkAdminAccess({ req });

  if (!hasAccess) {
    return {
      props: {
        errorCode: 401,
      },
    };
  }

  return { props: {} };
}

export default UploadFiles;

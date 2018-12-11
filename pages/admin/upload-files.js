import React from 'react';
import Head from 'next/head';

import Error from '../_error';

import ProtectedPage from '../mixins/protected';
import Wrapper from '../../components/Wrapper';
import Header from '../../components/Header';
import Content from '../../components/Content';
import UploadFilesForm from '../../components/admin/UploadFilesForm';

class UploadFiles extends ProtectedPage {
  render() {
    if (this.props.error) {
      return <Error statusCode={this.props.error.status} />;
    }

    const title = 'Завантажити файли';

    return (
      <Wrapper>
        <Head>
          <title>{title}</title>
        </Head>
        <Header />
        <Content>
          <UploadFilesForm title={title} />
        </Content>
      </Wrapper>
    );
  }
}

export default UploadFiles;

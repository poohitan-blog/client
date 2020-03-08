import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

import Error from './_error';

import withSession from '../hocs/withSession';
import withProtection from '../hocs/withProtection';
import Wrapper from '../components/Wrapper';
import Header from '../components/Header';
import Content from '../components/Content';
import UploadFilesForm from '../components/admin/UploadFilesForm';

const UploadFiles = (props) => {
  const { error } = props;

  if (error) {
    return <Error statusCode={error.status} />;
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
};

UploadFiles.propTypes = {
  error: PropTypes.shape({
    status: PropTypes.number,
  }),
};

UploadFiles.defaultProps = {
  error: null,
};

export default withProtection(withSession(UploadFiles));

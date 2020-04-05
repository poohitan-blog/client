import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

import Error from 'Pages/_error';

import withSession from 'Hocs/withSession';
import withProtection from 'Hocs/withProtection';
import Wrapper from 'Components/Wrapper';
import Header from 'Components/Header';
import Content from 'Components/Content';
import UploadFilesForm from 'Components/admin/UploadFilesForm';

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

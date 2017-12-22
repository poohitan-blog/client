import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Wrapper from '../components/Wrapper';
import * as Data from '../services/data';

const pagePage = (props) => {
  const page = Data.pages.find(page => page.path === props.url.query.path); // eslint-disable-line
  const markup = { __html: page.body };

  return (
    <Wrapper>
      <Head>
        <title>{page.title}</title>
      </Head>
      <div className="page-body" dangerouslySetInnerHTML={markup} />
    </Wrapper>
  );
};

pagePage.propTypes = {
  url: PropTypes.shape({
    query: PropTypes.shape({
      path: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default pagePage;

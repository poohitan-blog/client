import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Wrapper from '../components/Wrapper';
import Post from '../components/Post';
import * as Data from '../services/data';

const postPage = (props) => {
  const post = Data.posts.find(post => post.path === props.url.query.path); // eslint-disable-line

  return (
    <Wrapper>
      <Head>
        <title>{post.title}</title>
      </Head>
      <Post {...post} />
    </Wrapper>
  );
};

postPage.propTypes = {
  url: PropTypes.shape({
    query: PropTypes.shape({
      path: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default postPage;

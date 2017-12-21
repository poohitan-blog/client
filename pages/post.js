import React from 'react';
import PropTypes from 'prop-types';
import Layout from '../components/Layout';
import Post from '../components/Post';
import posts from '../services/data';

const page = (props) => {
  const postForThisPage = posts.find(post => post.path === props.url.query.path);

  return (
    <Layout>
      <Post {...postForThisPage} />
    </Layout>
  );
};

page.propTypes = {
  url: PropTypes.shape({
    query: PropTypes.shape({
      path: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default page;

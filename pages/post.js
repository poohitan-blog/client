import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import API from '../services/api';
import Wrapper from '../components/Wrapper';
import Post from '../components/Post';
import CommentForm from '../components/post/CommentForm';

class PostPage extends React.Component {
  static async getInitialProps({ query }) {
    const post = await API.posts.findByPath(query.path);

    return { post };
  }

  render() {
    return (
      <Wrapper>
        <Head>
          <title>{this.props.post.title} - poohitan</title>
        </Head>
        <Post {...this.props.post} />
        <CommentForm {...this.props.post} />
      </Wrapper>
    );
  }
}

PostPage.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }).isRequired,
};

export default PostPage;

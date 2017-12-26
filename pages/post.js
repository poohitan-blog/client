import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Error from './_error';
import API from '../services/api';
import Wrapper from '../components/Wrapper';
import Post from '../components/Post';
import CommentForm from '../components/post/CommentForm';
import * as Text from '../services/text';

class PostPage extends React.Component {
  static async getInitialProps({ query }) {
    try {
      const post = await API.posts.findByPath(query.path);
      const images = Text.getImagesFromHTML(post.body);

      return { post, images };
    } catch (error) {
      return { error };
    }
  }

  render() {
    if (this.props.error) {
      return <Error statusCode={this.props.error.status} />;
    }

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
  }),

  error: PropTypes.shape({
    status: PropTypes.number,
  }),
};

PostPage.defaultProps = {
  post: {},
  error: null,
};

export default PostPage;

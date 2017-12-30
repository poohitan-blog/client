import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Error from './_error';
import API from '../services/api';
import { getAllCookies } from '../services/cookies';
import Session from '../services/session';
import * as Text from '../services/text';

import Wrapper from '../components/Wrapper';
import Header from '../components/Header';
import Content from '../components/Content';
import Footer from '../components/Footer';
import Post from '../components/Post';
import CommentForm from '../components/post/CommentForm';

class PostPage extends React.Component {
  static async getInitialProps({ query, req }) {
    try {
      const isAuthenticated = Session.isAuthenticated(req);
      const post = await API.posts.findOne(query.path, getAllCookies(req));
      const images = Text.getImagesFromHTML(post.body);
      const commentsCountByPostPath = await API.posts.fetchCommentsCount();
      const postWithCommentsCount = Object.assign({ commentsCount: commentsCountByPostPath[post.path] }, post);

      return { post: postWithCommentsCount, images, isAuthenticated };
    } catch (error) {
      return { error };
    }
  }

  getChildContext() {
    return { isAuthenticated: this.props.isAuthenticated };
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
        <Header />
        <Content>
          <Post {...this.props.post} />
          <CommentForm {...this.props.post} />
        </Content>
        <Footer />
      </Wrapper>
    );
  }
}

PostPage.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,

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

PostPage.childContextTypes = {
  isAuthenticated: PropTypes.bool,
};

export default PostPage;

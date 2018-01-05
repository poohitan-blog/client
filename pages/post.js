import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Error from './_error';
import { current } from '../config';
import API from '../services/api';
import { getAllCookies } from '../services/cookies';
import * as Text from '../services/text';

import AuthenticatablePage from './_authenticatable';
import Wrapper from '../components/Wrapper';
import Header from '../components/Header';
import Content from '../components/Content';
import Footer from '../components/Footer';
import Post from '../components/Post';
import CommentForm from '../components/post/CommentForm';
import BlogPosting from '../components/jsonld/BlogPosting';

class PostPage extends AuthenticatablePage {
  static async getInitialProps({ query, req }) {
    try {
      const parentProps = await super.getInitialProps({ req });
      const post = await API.posts.findOne(query.path, getAllCookies(req));
      const commentsCountByPostPath = await API.posts.fetchCommentsCount();
      const postWithCommentsCount = Object.assign({ commentsCount: commentsCountByPostPath[post.path] }, post);

      return Object.assign(parentProps, { post: postWithCommentsCount });
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
          <title>{this.props.post.title} - {current.meta.title}</title>
          <meta name="description" content={Text.stripHTML(Text.shorten(this.props.post.body, 60))} key="description" />
          <meta name="keywords" content={this.props.post.tags.join(', ')} key="keywords" />
          <BlogPosting {...this.props.post} />
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

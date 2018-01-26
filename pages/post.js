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

      return Object.assign(parentProps, { post });
    } catch (error) {
      return { error };
    }
  }

  render() {
    if (this.props.error) {
      return <Error statusCode={this.props.error.status} />;
    }

    const { post } = this.props;
    const title = `${post.title} - ${current.meta.title}`;
    const description = Text.stripHTML(Text.shorten(post.body, 60));
    const image = Text.getImageLinksFromHTML(post.body)[0];
    const url = `${current.clientURL}/p/${post.path}`;

    return (
      <Wrapper>
        <Head>
          <title>{title}</title>
          <meta name="description" content={description} key="description" />
          <meta name="keywords" content={post.tags.join(', ')} key="keywords" />

          <BlogPosting {...post} />

          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={description} />
          <meta name="twitter:site" content={current.meta.social.twitter.username} />
          <meta name="twitter:creator" content={current.meta.social.twitter.username} />
          <meta name="twitter:image:src" content={image} />

          <meta name="og:title" content={title} />
          <meta name="og:description" content={description} />
          <meta name="og:image" content={image} />
          <meta name="og:url" content={url} />
          <meta name="og:site_name" content={current.meta.title} />
          <meta name="og:locale" content={current.meta.language} />
          <meta name="og:type" content="website" />
        </Head>
        <Header />
        <Content>
          <Post {...post} key={post.path} />
          <CommentForm {...post} />
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

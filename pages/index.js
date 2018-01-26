import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Error from './_error';
import { current } from '../config';

import API from '../services/api';
import { getAllCookies } from '../services/cookies';

import AuthenticatablePage from './_authenticatable';
import Wrapper from '../components/Wrapper';
import Header from '../components/Header';
import Content from '../components/Content';
import Footer from '../components/Footer';
import Post from '../components/Post';

import Blog from '../components/jsonld/Blog';

const POSTS_PER_PAGE = 10;

class IndexPage extends AuthenticatablePage {
  static async getInitialProps({ query, req }) {
    try {
      const parentProps = await super.getInitialProps({ query, req });
      const { page = 1 } = query;
      const { docs, meta } = await API.posts.find({ page, limit: POSTS_PER_PAGE }, getAllCookies(req));

      return Object.assign(parentProps, { posts: docs, meta });
    } catch (error) {
      return { error };
    }
  }

  render() {
    if (this.props.error) {
      return <Error statusCode={this.props.error.status} />;
    }

    const content = this.props.posts.map(post => <Post {...post} cut key={post.id} />);
    const {
      title,
      description,
      keywords,
      language,
      social,
    } = current.meta;

    return (
      <Wrapper>
        <Head>
          <title>{title}</title>
          <meta name="description" content={description} key="description" />
          <meta name="keywords" content={keywords.join(', ')} key="keywords" />

          <Blog />

          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={description} />
          <meta name="twitter:site" content={social.twitter.username} />
          <meta name="twitter:creator" content={social.twitter.username} />

          <meta name="og:title" content={title} />
          <meta name="og:description" content={description} />
          <meta name="og:url" content={current.clientURL} />
          <meta name="og:site_name" content={title} />
          <meta name="og:locale" content={language} />
          <meta name="og:type" content="website" />
        </Head>
        <Header />
        <Content>
          {content}
        </Content>
        <Footer pagination={this.props.meta} />
      </Wrapper>
    );
  }
}

IndexPage.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,

  meta: PropTypes.shape({
    currentPage: PropTypes.number,
    totalPages: PropTypes.number,
  }).isRequired,

  error: PropTypes.shape({
    status: PropTypes.number,
  }),
};

IndexPage.defaultProps = {
  error: null,
};

export default IndexPage;

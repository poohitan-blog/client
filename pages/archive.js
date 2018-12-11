import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import API from '../services/api';
import Error from './_error';
import { current } from '../config';
import { getAllCookies } from '../services/cookies';

import AuthenticatablePage from './mixins/authenticatable';
import Wrapper from '../components/Wrapper';
import Header from '../components/Header';
import Content from '../components/Content';
import Footer from '../components/Footer';
import CompactPost from '../components/CompactPost';

const POSTS_PER_PAGE = 30;

class ArchivePage extends AuthenticatablePage {
  static async getInitialProps({ query, req, res, asPath }) {
    try {
      const parentProps = await super.getInitialProps({ query, req, res, asPath });
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

    const content = this.props.posts
      .map(post => ({ id: post.id, component: <CompactPost {...post} key={post.id} /> }))
      .reduce((previousPosts, { id, component }) => {
        if (!previousPosts.length) {
          return [component];
        }

        return [...previousPosts, <hr key={`hr${id}`} />, component];
      }, []);

    return (
      <Wrapper>
        <Head>
          <title>Архів - {current.meta.title}</title>
        </Head>
        <Header />
        <Content>
          <h1>Архів</h1>
          { content }
        </Content>
        <Footer pagination={this.props.meta} />
      </Wrapper>
    );
  }
}

ArchivePage.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,

  meta: PropTypes.shape({
    currentPage: PropTypes.number,
    totalPages: PropTypes.number,
  }).isRequired,

  error: PropTypes.shape({
    status: PropTypes.number,
  }),
};

ArchivePage.defaultProps = {
  error: null,
};

export default ArchivePage;

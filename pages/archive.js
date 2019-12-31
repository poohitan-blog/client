import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

import API from '../services/api';
import Error from './_error';
import { current } from '../config';
import { getAllCookies } from '../services/cookies';

import AuthenticatablePage from './_authenticatable';
import Wrapper from '../components/Wrapper';
import Header from '../components/Header';
import Content from '../components/Content';
import Footer from '../components/Footer';
import CompactPost from '../components/CompactPost';

const POSTS_PER_PAGE = 30;

class ArchivePage extends AuthenticatablePage {
  static async getInitialProps({ query, req, pathname }) {
    try {
      const parentProps = await super.getInitialProps({ query, req });
      const { page = 1 } = query;
      const { docs, meta } = await API.posts.find({ page, limit: POSTS_PER_PAGE }, getAllCookies(req));

      return {
        ...parentProps,
        posts: docs,
        meta,
        pathname,
      };
    } catch (error) {
      return { error };
    }
  }

  render() {
    const {
      posts, error, meta, pathname,
    } = this.props;

    if (error) {
      return <Error statusCode={error.status} />;
    }

    const content = posts
      .map((post) => ({
        id: post.id,
        component: (
          <CompactPost
            key={post.id}
            title={post.title}
            body={post.body}
            path={post.path}
            publishedAt={new Date(post.publishedAt)}
            private={post.private}
          />
        ),
      }))
      .reduce((previousPosts, { id, component }) => {
        if (!previousPosts.length) {
          return [component];
        }

        return [...previousPosts, <hr key={`hr${id}`} />, component];
      }, []);

    const description = posts.map((post) => post.title.toLowerCase()).join(', ');

    return (
      <Wrapper pathname={pathname}>
        <Head>
          <title>{`Архів - ${current.meta.title}`}</title>
          <link rel="canonical" href={`${current.clientURL}/archive`} />
          <meta name="description" content={`Архів записів — ${description}`} key="description" />
        </Head>
        <Header />
        <Content>
          <h1>Архів</h1>
          { content }
        </Content>
        <Footer pagination={meta} />
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

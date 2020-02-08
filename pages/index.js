import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

import Error from './_error';
import { current } from '../config';

import API from '../services/api';
import { getAllCookies } from '../services/cookies';

import withSession from '../hocs/withSession';

import Wrapper from '../components/Wrapper';
import Header from '../components/Header';
import Content from '../components/Content';
import Footer from '../components/Footer';
import Post from '../components/Post';

import Blog from '../components/jsonld/Blog';

const POSTS_PER_PAGE = 20;

class IndexPage extends React.Component {
  static async getInitialProps({ query, req, pathname }) {
    try {
      const { page = 1 } = query;
      const { docs, meta } = await API.posts.find({
        page,
        limit: POSTS_PER_PAGE,
        cut: true,
      }, getAllCookies(req));

      return {
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
      posts,
      meta,
      pathname,
      error,
    } = this.props;

    if (error) {
      return <Error statusCode={error.status} />;
    }

    const content = posts.map((post) => (
      <Post
        cut
        key={post.id}
        title={post.title}
        body={post.body}
        path={post.path}
        private={post.private}
        language={post.language}
        translations={post.translations}
        commentsCount={post.commentsCount}
        publishedAt={new Date(post.publishedAt)}
        tags={post.tags}
      />
    ));

    const {
      title,
      description,
      keywords,
      languageTerritory,
      social,
    } = current.meta;

    const { currentPage } = meta;
    const canonicalUrl = currentPage === 1
      ? current.clientURL
      : `${current.clientURL}?page=${currentPage}`;

    return (
      <>
        <Head>
          <title>{title}</title>

          <link rel="canonical" href={canonicalUrl} />

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
          <meta name="og:locale" content={languageTerritory} />
          <meta name="og:type" content="website" />
        </Head>
        <Wrapper pathname={pathname}>
          <Header />
          <Content>
            {content}
          </Content>
          <Footer pagination={meta} />
        </Wrapper>
      </>
    );
  }
}

IndexPage.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,

  pathname: PropTypes.string.isRequired,

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

export default withSession(IndexPage);

import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { parseCookies } from 'nookies';

import { current } from 'Config';
import API from 'Services/api';
import Error from 'Pages/_error';

import withSession from 'Hocs/withSession';
import Wrapper from 'Components/Wrapper';
import Header from 'Components/Header';
import Content from 'Components/Content';
import Footer from 'Components/Footer';
import CompactPost from 'Components/CompactPost';

const POSTS_PER_PAGE = 30;

class ArchivePage extends React.Component {
  static async getInitialProps({ query, req, pathname }) {
    try {
      const { page = 1 } = query;
      const { docs, meta } = await API.posts.find({
        page,
        limit: POSTS_PER_PAGE,
        cut: true,
      }, parseCookies({ req }));

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
      posts, error, meta,
    } = this.props;

    if (error) {
      return <Error statusCode={error.status} />;
    }

    const content = posts
      .map((post) => ({
        slug: post.slug,
        component: (
          <CompactPost
            key={post.slug}
            title={post.title}
            body={post.body}
            slug={post.slug}
            publishedAt={new Date(post.publishedAt)}
            hidden={post.hidden}
          />
        ),
      }))
      .reduce((previousPosts, { slug, component }) => {
        if (!previousPosts.length) {
          return [component];
        }

        return [...previousPosts, <hr key={`hr-${slug}`} />, component];
      }, []);

    const { currentPage } = meta;
    const canonicalUrl = currentPage === 1
      ? `${current.clientURL}/archive`
      : `${current.clientURL}/archive?page=${currentPage}`;

    const description = posts.map((post) => post.title.toLowerCase()).join(', ');

    return (
      <Wrapper>
        <Head>
          <title>{`Архів - ${current.meta.title}`}</title>
          <link rel="canonical" href={canonicalUrl} />
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

export default withSession(ArchivePage);
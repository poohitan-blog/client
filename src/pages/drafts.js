import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { parseCookies } from 'nookies';

import { current } from 'config';
import Error from 'pages/_error';
import API from 'services/api';

import withSession from 'hocs/withSession';
import Wrapper from 'components/Wrapper';
import Header from 'components/Header';
import Content from 'components/Content';
import Footer from 'components/Footer';
import Post from 'components/Post';

const Lightbox = dynamic(() => import('components/ui/Lightbox'), { ssr: false, loading: () => null });

const POSTS_PER_PAGE = 10;

class DraftsPage extends React.Component {
  static async getInitialProps({ query, req, pathname }) {
    try {
      const { page = 1 } = query;
      const { docs, meta } = await API.posts.find({
        page,
        limit: POSTS_PER_PAGE,
        cut: true,
        hidden: true,
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
      posts,
      meta,
      error,
    } = this.props;

    if (error) {
      return <Error statusCode={error.status} />;
    }

    const content = posts.map((post) => (
      <Post
        cut
        key={post.slug}
        title={post.title}
        body={post.body}
        slug={post.slug}
        hidden
        language={post.language}
        translations={post.translations}
        commentsCount={post.commentsCount}
        publishedAt={new Date(post.publishedAt)}
        tags={post.tags}
      />
    ));

    const {
      title,
    } = current.meta;

    return (
      <>
        <Head>
          <title>Чернетки</title>
        </Head>
        <Wrapper>
          <Header />
          <Content>
            {content}
          </Content>
          <Footer pagination={meta} />
          <Lightbox id={posts.map((post) => post.slug).join('-')} />
        </Wrapper>
      </>
    );
  }
}

DraftsPage.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,

  meta: PropTypes.shape({
    currentPage: PropTypes.number,
    totalPages: PropTypes.number,
  }).isRequired,

  error: PropTypes.shape({
    status: PropTypes.number,
  }),
};

DraftsPage.defaultProps = {
  error: null,
};

export default withSession(DraftsPage);

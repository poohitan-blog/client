import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { parseCookies } from 'nookies';

import { current } from 'config';
import Error from 'pages/_error';
import API from 'services/api';
import { generateTrashPostTitle } from 'services/text';

import withSession from 'hocs/withSession';
import Wrapper from 'components/Wrapper';
import Header from 'components/Header';
import Content from 'components/Content';
import Footer from 'components/Footer';
import TrashPost from 'components/TrashPost';
import Trashbin from 'components/header/Trashbin';

const Lightbox = dynamic(() => import('components/ui/Lightbox'), { ssr: false, loading: () => null });

const POSTS_PER_PAGE = 30;

class TrashPage extends React.Component {
  static async getInitialProps({ query, req, pathname }) {
    try {
      if (query.id || query.random) {
        const posts = query.random
          ? [await API.trashPosts.findRandom(parseCookies({ req }))]
          : [await API.trashPosts.findOne(query.id, parseCookies({ req }))];

        return {
          posts,
          pathname,
          single: true,
        };
      }

      if (query.permalink) { // keeps compatibility with old version of links
        const { docs } = await API.trashPosts.find({ permalink: query.permalink }, parseCookies({ req }));

        return {
          posts: docs,
          pathname,
          single: true,
        };
      }

      const { page = 1 } = query;
      const { docs, meta } = await API.trashPosts.find({ page, limit: POSTS_PER_PAGE }, parseCookies({ req }));

      return {
        posts: docs,
        meta,
        pathname,
      };
    } catch (error) {
      return { error };
    }
  }

  constructor(props) {
    super(props);

    this.generateCanonicalUrl = this.generateCanonicalUrl.bind(this);
  }

  generateCanonicalUrl() {
    const { posts, single, meta } = this.props;
    const { currentPage } = meta;

    if (single) {
      const [post] = posts;

      return `${current.clientURL}/trash/${post.id}`;
    }

    if (currentPage !== 1) {
      return `${current.clientURL}/trash?page=${currentPage}`;
    }

    return `${current.clientURL}/trash`;
  }

  render() {
    const {
      posts,
      meta,
      error,
      single,
    } = this.props;

    if (error) {
      return <Error statusCode={error.status} />;
    }

    if (posts.length === 0) {
      return <Error statusCode={404} />;
    }

    const postsMarkup = posts.map((post) => (
      <TrashPost
        id={post.id}
        key={`${post.id}-${single}`}
        collapsable={!single}
        body={post.body}
        createdAt={new Date(post.createdAt)}
      />
    ));
    const paginationInfo = { ...meta, linkTexts: { next: 'Далі', previous: 'Назад' } };

    const postTitle = single ? generateTrashPostTitle(posts[0].body) : null;
    const pageTitle = [postTitle, 'Смітник', current.meta.title].filter((item) => item).join(' - ');

    const canonicalURL = this.generateCanonicalUrl();

    return (
      <Wrapper>
        <Head>
          <title>{pageTitle}</title>
          <link rel="canonical" href={canonicalURL} />
        </Head>
        <Header trashBinState={Trashbin.STATES.FULLY_OPEN} />
        <Content>
          <h1>Смітник</h1>
          {postsMarkup}
        </Content>
        <Footer pagination={paginationInfo} />
        <Lightbox id={posts.map((post) => post.id).join('-')} />
      </Wrapper>
    );
  }
}

TrashPage.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object),

  error: PropTypes.shape({
    status: PropTypes.number,
  }),

  meta: PropTypes.shape({
    currentPage: PropTypes.number,
    totalPages: PropTypes.number,
  }),

  single: PropTypes.bool,
};

TrashPage.defaultProps = {
  posts: [],
  meta: {},
  error: null,
  single: false,
};

export default withSession(TrashPage);

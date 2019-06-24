import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
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
import TrashPost from '../components/TrashPost';
import Trashbin from '../components/header/Trashbin';

const POSTS_PER_PAGE = 30;

class TrashPage extends AuthenticatablePage {
  static async getInitialProps({ query, req, pathname }) {
    try {
      const parentProps = await super.getInitialProps({ req });

      if (query.id) {
        const posts = [await API.trashPosts.findOne(query.id, getAllCookies(req))];

        return Object.assign(parentProps, { posts, pathname });
      }

      if (query.permalink) { // keeps compatibility with old version of links
        const date = moment.utc(query.permalink, 'YYYYMMDD_HHmmss').toISOString();
        const { docs } = await API.trashPosts.find({ createdAt: date }, getAllCookies(req));

        return Object.assign(parentProps, { posts: docs, pathname });
      }

      const { page = 1 } = query;
      const { docs, meta } = await API.trashPosts.find({ page, limit: POSTS_PER_PAGE }, getAllCookies(req));

      return Object.assign(parentProps, { posts: docs, meta, pathname });
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

    const postsMarkup = posts.map(post => <TrashPost {...post} key={post.id} collapsable={posts.length > 1} />);
    const paginationInfo = { ...meta, linkTexts: { next: 'Далі', previous: 'Назад' } };

    return (
      <Wrapper pathname={pathname}>
        <Head>
          <title>Смітник - {current.meta.title}</title>
        </Head>
        <Header trashBinState={Trashbin.STATES.FULLY_OPEN} />
        <Content>
          <h1>Смітник</h1>
          { postsMarkup }
        </Content>
        <Footer pagination={paginationInfo} />
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
};

TrashPage.defaultProps = {
  posts: [],
  meta: {},
  error: null,
};

export default TrashPage;

import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Head from 'next/head';
import Error from './_error';
import API from '../services/api';

import Wrapper from '../components/Wrapper';
import Header from '../components/Header';
import Content from '../components/Content';
import Footer from '../components/Footer';
import TrashPost from '../components/TrashPost';
import Trashbin from '../components/header/Trashbin';

const POSTS_PER_PAGE = 15;

class TrashPage extends React.Component {
  static async getInitialProps({ query }) {
    try {
      if (query.id) {
        const posts = [await API.trashPosts.findOne(query.id)];

        return { posts };
      }

      if (query.permalink) { // keeps compatibility with old version of links
        const date = moment.utc(query.permalink, 'YYYYMMDD_HHmmss').toISOString();
        const { docs } = await API.trashPosts.find({ createdAt: date });

        return { posts: docs };
      }

      const { page = 1 } = query;
      const { docs, meta } = await API.trashPosts.find({ page, limit: POSTS_PER_PAGE });

      return { posts: docs, meta };
    } catch (error) {
      return { error };
    }
  }

  render() {
    if (this.props.error) {
      return <Error statusCode={this.props.error.status} />;
    }

    const postsMarkup = this.props.posts.map(post => <TrashPost {...post} key={post.id} />);
    const paginationInfo = { ...this.props.meta, linkTexts: { next: 'Далі', previous: 'Назад' } };

    return (
      <Wrapper>
        <Head>
          <title>Смітник - poohitan</title>
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
  }).isRequired,
};

TrashPage.defaultProps = {
  posts: [],
  error: null,
};

export default TrashPage;

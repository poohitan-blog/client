import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import API from '../services/api';

import Wrapper from '../components/Wrapper';
import Header from '../components/Header';
import Content from '../components/Content';
import Footer from '../components/Footer';
import CompactPost from '../components/CompactPost';

const POSTS_PER_PAGE = 50;

class ArchivePage extends React.Component {
  static async getInitialProps({ query }) {
    const { page = 1 } = query;
    const { docs, meta } = await API.posts.find({ page, limit: POSTS_PER_PAGE });

    return { posts: docs, meta };
  }

  render() {
    const postsMarkup = this.props.posts
      .map(post => <CompactPost {...post} key={post.id} />)
      .reduce((previousPosts, currentPost) => [previousPosts, <hr />, currentPost]);

    return (
      <Wrapper>
        <Head>
          <title>Архів - poohitan</title>
        </Head>
        <Header />
        <Content>
          { postsMarkup }
        </Content>
        <Footer />
      </Wrapper>
    );
  }
}

ArchivePage.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ArchivePage;

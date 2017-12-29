import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import API from '../services/api';

import Wrapper from '../components/Wrapper';
import Header from '../components/Header';
import Content from '../components/Content';
import Footer from '../components/Footer';
import CompactPost from '../components/CompactPost';

const POSTS_PER_PAGE = 30;

class ArchivePage extends React.Component {
  static async getInitialProps({ query }) {
    const { page = 1 } = query;
    const { docs, meta } = await API.posts.find({ page, limit: POSTS_PER_PAGE });

    return { posts: docs, meta, query };
  }

  render() {
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
          <title>Архів - poohitan</title>
        </Head>
        <Header />
        <Content>
          { content }
        </Content>
        <Footer pagination={this.props.meta} query={this.props.query} />
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

  query: PropTypes.shape({}),
};

ArchivePage.defaultProps = {
  query: {},
};

export default ArchivePage;

import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import API from '../services/api';

import Wrapper from '../components/Wrapper';
import Header from '../components/Header';
import Content from '../components/Content';
import Footer from '../components/Footer';
import Post from '../components/Post';

const POSTS_PER_PAGE = 10;

class IndexPage extends React.Component {
  static async getInitialProps({ query }) {
    const { page = 1 } = query;
    const { docs, meta } = await API.posts.find({ page, limit: POSTS_PER_PAGE });
    const commentsCountByPostPath = await API.posts.fetchCommentsCount();
    const posts = docs.map(post => Object.assign({
      commentsCount: commentsCountByPostPath[post.path],
    }, post));

    return { posts, meta, query };
  }

  render() {
    const content = this.props.posts.map(post => <Post {...post} cut key={post.id} />);

    return (
      <Wrapper>
        <Head>
          <title>poohitan</title>
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

IndexPage.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,

  meta: PropTypes.shape({
    currentPage: PropTypes.number,
    totalPages: PropTypes.number,
  }).isRequired,

  query: PropTypes.shape({}),
};

IndexPage.defaultProps = {
  query: {},
};

export default IndexPage;

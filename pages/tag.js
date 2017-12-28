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

class TagPage extends React.Component {
  static async getInitialProps({ query }) {
    const { tag, page = 1 } = query;
    const { docs, meta } = await API.posts.find({ tag, page, limit: POSTS_PER_PAGE });

    return { posts: docs, meta, tag };
  }

  render() {
    const postsFound = this.props.posts.length;
    let content;

    if (postsFound) {
      content = this.props.posts
        .map(post => <CompactPost {...post} key={post.id} />)
        .reduce((previousPosts, currentPost) => {
          if (!previousPosts.length) {
            return currentPost;
          }

          return [...previousPosts, <hr key={`hr${currentPost.id}`} />, currentPost];
        }, []);
    } else {
      content = <div>Нічого не знайдено.</div>;
    }

    return (
      <Wrapper>
        <Head>
          <title>Записи з теґом «{this.props.tag}» - poohitan</title>
        </Head>
        <Header />
        <Content>
          <h1>Записи з теґом «{this.props.tag}»</h1>
          { content }
        </Content>
        <Footer pagination={this.props.meta} />
      </Wrapper>
    );
  }
}

TagPage.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,
  tag: PropTypes.string.isRequired,
  meta: PropTypes.shape({
    currentPage: PropTypes.number,
    totalPages: PropTypes.number,
  }).isRequired,
};

export default TagPage;

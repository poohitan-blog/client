import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import API from '../services/api';

import Wrapper from '../components/Wrapper';
import Header from '../components/Header';
import Content from '../components/Content';
import Footer from '../components/Footer';
import CompactPost from '../components/CompactPost';

class TagPage extends React.Component {
  static async getInitialProps({ query }) {
    const { tag } = query;
    const { docs, meta } = await API.posts.find({ tag });

    return { posts: docs, meta, tag };
  }

  render() {
    const postsMarkup = this.props.posts
      .map(post => <CompactPost {...post} key={post.id} />)
      .reduce((previousPosts, currentPost) => [previousPosts, <hr />, currentPost]);

    return (
      <Wrapper>
        <Head>
          <title>Записи з теґом «{this.props.tag}» - poohitan</title>
        </Head>
        <Header />
        <Content>
          <h1>Записи з теґом «{this.props.tag}»</h1>
          { postsMarkup }
        </Content>
        <Footer />
      </Wrapper>
    );
  }
}

TagPage.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,
  tag: PropTypes.string.isRequired,
};

export default TagPage;

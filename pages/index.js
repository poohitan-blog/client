import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import API from '../services/api';
import Wrapper from '../components/Wrapper';
import Post from '../components/Post';

class IndexPage extends React.Component {
  static async getInitialProps() {
    const posts = await API.posts.findAll();

    return { posts };
  }

  render() {
    const postsMarkup = this.props.posts.map(post => <Post {...post} cut key={post.id} />);

    return (
      <Wrapper>
        <Head>
          <title>poohitan</title>
        </Head>
        { postsMarkup }
      </Wrapper>
    );
  }
}

IndexPage.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default IndexPage;

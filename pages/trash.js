import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Wrapper from '../components/Wrapper';
import TrashPost from '../components/TrashPost';
import API from '../services/api';

class TrashPage extends React.Component {
  static async getInitialProps({ query }) {
    let posts = [];

    if (query && query.id) {
      posts = [await API.trashPosts.findById(query.id)];
    } else {
      posts = await API.trashPosts.findAll();
    }

    return { posts };
  }

  render() {
    const postsMarkup = this.props.posts.map(post => <TrashPost {...post} key={post.id} />);

    return (
      <Wrapper>
        <Head>
          <title>Смітник - poohitan</title>
        </Head>
        <div className="page-body">
          <h1>Смітник</h1>
          { postsMarkup }
        </div>
      </Wrapper>
    );
  }
}

TrashPage.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default TrashPage;

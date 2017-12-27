import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Wrapper from '../components/Wrapper';
import CompactPost from '../components/CompactPost';
import API from '../services/api';

const POSTS_PER_PAGE = 50;

class ArchivePage extends React.Component {
  static async getInitialProps({ query }) {
    const { page = 1 } = query;
    const { docs, meta } = await API.posts.find({ page, limit: POSTS_PER_PAGE });

    return { posts: docs, meta };
  }

  render() {
    const postsMarkup = this.props.posts.map((post, index) => {
      if (index) {
        return (<div key={post.id}><hr /><CompactPost {...post} /></div>);
      }

      return <CompactPost {...post} key={post.id} />;
    });

    return (
      <Wrapper>
        <Head>
          <title>Архів - poohitan</title>
        </Head>
        <div className="page-body">
          { postsMarkup }
        </div>
      </Wrapper>
    );
  }
}

ArchivePage.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ArchivePage;

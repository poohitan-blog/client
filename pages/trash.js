import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Head from 'next/head';
import Error from './_error';
import Wrapper from '../components/Wrapper';
import TrashPost from '../components/TrashPost';
import Trashbin from '../components/header/Trashbin';
import API from '../services/api';

class TrashPage extends React.Component {
  static async getInitialProps({ query }) {
    try {
      let posts = [];

      if (query.id) {
        posts = [await API.trashPosts.findById(query.id)];
      } else if (query.permalink) { // keeps compatibility with old version of links
        const date = moment.utc(query.permalink, 'YYYYMMDD_HHmmss').toDate();
        posts = await API.trashPosts.findByDate(date);
      } else {
        posts = await API.trashPosts.findAll();
      }

      return { posts };
    } catch (error) {
      return { error };
    }
  }

  render() {
    if (this.props.error) {
      return <Error statusCode={this.props.error.status} />;
    }

    const postsMarkup = this.props.posts.map(post => <TrashPost {...post} key={post.id} />);

    return (
      <Wrapper trashBinState={Trashbin.STATES.FULLY_OPEN}>
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
  posts: PropTypes.arrayOf(PropTypes.object),

  error: PropTypes.shape({
    status: PropTypes.number,
  }),
};

TrashPage.defaultProps = {
  posts: [],
  error: null,
};

export default TrashPage;

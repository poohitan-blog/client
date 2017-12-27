import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Wrapper from '../components/Wrapper';
import CompactPost from '../components/CompactPost';
import API from '../services/api';

class TagPage extends React.Component {
  static async getInitialProps({ query }) {
    const { tag } = query;
    const posts = await API.posts.find({ tag });

    return { posts, tag };
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
          <title>Записи з теґом «{this.props.tag}» - poohitan</title>
        </Head>
        <div className="page-body">
          <h1>Записи з теґом «{this.props.tag}»</h1>
          { postsMarkup }
        </div>
      </Wrapper>
    );
  }
}

TagPage.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,
  tag: PropTypes.string.isRequired,
};

export default TagPage;

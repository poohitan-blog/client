import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import API from '../services/api';
import Error from './_error';
import { getAllCookies } from '../services/cookies';
import Session from '../services/session';

import Wrapper from '../components/Wrapper';
import Header from '../components/Header';
import Content from '../components/Content';
import Footer from '../components/Footer';
import CompactPost from '../components/CompactPost';

const POSTS_PER_PAGE = 30;

class TagPage extends React.Component {
  static async getInitialProps({ query, req }) {
    try {
      const isAuthenticated = Session.isAuthenticated(req);
      const { tag, page = 1 } = query;
      const { docs, meta } = await API.posts.find({ tag, page, limit: POSTS_PER_PAGE }, getAllCookies(req));

      return {
        posts: docs,
        meta,
        tag,
        isAuthenticated,
      };
    } catch (error) {
      return { error };
    }
  }

  getChildContext() {
    return { isAuthenticated: this.props.isAuthenticated };
  }

  render() {
    if (this.props.error) {
      return <Error statusCode={this.props.error.status} />;
    }

    const nothingFound = !this.props.posts.length;
    let content;

    if (nothingFound) {
      content = <p className="fatty text-center">Нічого не знайшлося.</p>;
    } else {
      content = this.props.posts
        .map(post => ({ id: post.id, component: <CompactPost {...post} key={post.id} /> }))
        .reduce((previousPosts, { id, component }) => {
          if (!previousPosts.length) {
            return [component];
          }

          return [...previousPosts, <hr key={`hr${id}`} />, component];
        }, []);
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
  isAuthenticated: PropTypes.bool.isRequired,
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,
  tag: PropTypes.string.isRequired,

  meta: PropTypes.shape({
    currentPage: PropTypes.number,
    totalPages: PropTypes.number,
  }).isRequired,

  error: PropTypes.shape({
    status: PropTypes.number,
  }),
};

TagPage.defaultProps = {
  error: null,
};

TagPage.childContextTypes = {
  isAuthenticated: PropTypes.bool,
};

export default TagPage;

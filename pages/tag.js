import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import API from '../services/api';
import Error from './_error';
import { current } from '../config';
import { getAllCookies } from '../services/cookies';

import AuthenticatablePage from './_authenticatable';
import Wrapper from '../components/Wrapper';
import Header from '../components/Header';
import Content from '../components/Content';
import Footer from '../components/Footer';
import CompactPost from '../components/CompactPost';
import TagCloud from '../components/TagCloud';

const POSTS_PER_PAGE = 30;

class TagPage extends AuthenticatablePage {
  static async getInitialProps({ query, req }) {
    try {
      const parentProps = await super.getInitialProps({ req });
      const { tag, page = 1 } = query;
      const { docs, meta } = await API.posts.find({ tag, page, limit: POSTS_PER_PAGE }, getAllCookies(req));

      return Object.assign(parentProps, {
        posts: docs,
        meta,
        tag,
      });
    } catch (error) {
      return { error };
    }
  }

  render() {
    if (this.props.error) {
      return <Error statusCode={this.props.error.status} />;
    }

    const nothingFound = !this.props.posts.length;
    let content;

    if (nothingFound) {
      content = (
        <div className="text-center">
          <p className="fatty larger">Нічого не знайшлося.</p>
          <p>Хмаринка позначок:</p>
          <TagCloud shake minFontSize="1" maxFontSize="3" width="70%" />
        </div>
      );
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
          <title>Записи з позначкою «{this.props.tag}» - {current.meta.title}</title>
        </Head>
        <Header />
        <Content>
          <h1>Записи з позначкою «{this.props.tag}»</h1>
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

  error: PropTypes.shape({
    status: PropTypes.number,
  }),
};

TagPage.defaultProps = {
  error: null,
};

export default TagPage;

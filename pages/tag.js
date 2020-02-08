import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import API from '../services/api';
import Error from './_error';
import { current } from '../config';
import { getAllCookies } from '../services/cookies';

import withSession from '../hocs/withSession';
import Wrapper from '../components/Wrapper';
import Header from '../components/Header';
import Content from '../components/Content';
import Footer from '../components/Footer';
import CompactPost from '../components/CompactPost';
import TagCloud from '../components/TagCloud';

const POSTS_PER_PAGE = 30;

class TagPage extends React.Component {
  static async getInitialProps({ query, req, pathname }) {
    try {
      const { tag, page = 1 } = query;
      const { docs, meta } = await API.posts.find({
        tag,
        page,
        limit: POSTS_PER_PAGE,
        cut: true,
      }, getAllCookies(req));

      return {
        posts: docs,
        meta,
        tag,
        pathname,
      };
    } catch (error) {
      return { error };
    }
  }

  render() {
    const {
      posts, meta, tag, pathname, error,
    } = this.props;

    if (error) {
      return <Error statusCode={error.status} />;
    }

    const nothingFound = !posts.length;
    let content;

    if (nothingFound) {
      content = (
        <div className="text-center">
          <p className="fatty larger">Нічого не знайшлося.</p>
          <p>Хмаринка позначок:</p>
          <TagCloud shake minFontSize={1} maxFontSize={3} width="70%" />
        </div>
      );
    } else {
      content = posts
        .map((post) => ({
          id: post.id,
          component: (
            <CompactPost
              key={post.id}
              title={post.title}
              body={post.body}
              path={post.path}
              publishedAt={new Date(post.publishedAt)}
              private={post.private}
            />
          ),
        }))
        .reduce((previousPosts, { id, component }) => {
          if (!previousPosts.length) {
            return [component];
          }

          return [...previousPosts, <hr key={`hr${id}`} />, component];
        }, []);
    }

    const { currentPage } = meta;
    const canonicalUrl = currentPage === 1
      ? `${current.clientURL}/tag/${tag}`
      : `${current.clientURL}/tag/${tag}?page=${currentPage}`;

    return (
      <Wrapper pathname={pathname}>
        <Head>
          <title>{`Записи з позначкою «${tag}» - ${current.meta.title}`}</title>
          <meta name="description" content={`Записи про ${tag}`} key="description" />
          <link rel="canonical" href={canonicalUrl} />
        </Head>
        <Header />
        <Content>
          <h1>{`Записи з позначкою «${tag}»`}</h1>
          { content }
        </Content>
        <Footer pagination={meta} />
      </Wrapper>
    );
  }
}

TagPage.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,
  tag: PropTypes.string.isRequired,
  pathname: PropTypes.string.isRequired,

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

export default withSession(TagPage);

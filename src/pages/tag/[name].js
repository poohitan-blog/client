import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { parseCookies } from 'nookies';

import { current } from 'Config';
import API from 'Services/api';
import Error from 'Pages/_error';

import withSession from 'Hocs/withSession';
import Wrapper from 'Components/Wrapper';
import Header from 'Components/Header';
import Content from 'Components/Content';
import Footer from 'Components/Footer';
import CompactPost from 'Components/CompactPost';
import TagCloud from 'Components/TagCloud';

const POSTS_PER_PAGE = 30;

class TagPage extends React.Component {
  static async getInitialProps({ query, req, pathname }) {
    try {
      const { name, page = 1 } = query;
      const { docs, meta } = await API.posts.find({
        tag: name,
        page,
        limit: POSTS_PER_PAGE,
        cut: true,
      }, parseCookies({ req }));

      return {
        posts: docs,
        meta,
        tag: name,
        pathname,
      };
    } catch (error) {
      return { error };
    }
  }

  render() {
    const {
      posts, meta, tag, error,
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
          slug: post.slug,
          component: (
            <CompactPost
              key={post.slug}
              title={post.title}
              body={post.body}
              slug={post.slug}
              publishedAt={new Date(post.publishedAt)}
              hidden={post.hidden}
            />
          ),
        }))
        .reduce((previousPosts, { slug, component }) => {
          if (!previousPosts.length) {
            return [component];
          }

          return [...previousPosts, <hr key={`hr-${slug}`} />, component];
        }, []);
    }

    const { currentPage } = meta;
    const canonicalUrl = currentPage === 1
      ? `${current.clientURL}/tag/${tag}`
      : `${current.clientURL}/tag/${tag}?page=${currentPage}`;

    return (
      <Wrapper>
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

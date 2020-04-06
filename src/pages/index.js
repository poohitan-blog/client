import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { parseCookies } from 'nookies';

import { current } from 'Config';
import Error from 'Pages/_error';
import API from 'Services/api';

import withSession from 'Hocs/withSession';
import Wrapper from 'Components/Wrapper';
import Header from 'Components/Header';
import Content from 'Components/Content';
import Footer from 'Components/Footer';
import Post from 'Components/Post';
import Blog from 'Components/jsonld/Blog';

const Lightbox = dynamic(() => import('Components/ui/Lightbox'), { ssr: false, loading: () => null });

const POSTS_PER_PAGE = 20;

class IndexPage extends React.Component {
  static async getInitialProps({ query, req, pathname }) {
    try {
      const { page = 1 } = query;
      const { docs, meta } = await API.posts.find({
        page,
        limit: POSTS_PER_PAGE,
        cut: true,
      }, parseCookies({ req }));

      return {
        posts: docs,
        meta,
        pathname,
      };
    } catch (error) {
      return { error };
    }
  }

  render() {
    const {
      posts,
      meta,
      error,
    } = this.props;

    if (error) {
      return <Error statusCode={error.status} />;
    }

    const content = posts.map((post) => (
      <Post
        cut
        key={post.slug}
        title={post.title}
        body={post.body}
        slug={post.slug}
        hidden={post.hidden}
        language={post.language}
        translations={post.translations}
        commentsCount={post.commentsCount}
        publishedAt={new Date(post.publishedAt)}
        tags={post.tags}
      />
    ));

    const {
      title,
      description,
      keywords,
      languageTerritory,
      social,
    } = current.meta;

    const { currentPage } = meta;
    const canonicalUrl = currentPage === 1
      ? current.clientURL
      : `${current.clientURL}?page=${currentPage}`;

    return (
      <>
        <Head>
          <title>{title}</title>

          <link rel="canonical" href={canonicalUrl} />

          <meta name="description" content={description} key="description" />
          <meta name="keywords" content={keywords.join(', ')} key="keywords" />

          <Blog />

          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={description} />
          <meta name="twitter:site" content={social.twitter.username} />
          <meta name="twitter:creator" content={social.twitter.username} />

          <meta name="og:title" content={title} />
          <meta name="og:description" content={description} />
          <meta name="og:url" content={current.clientURL} />
          <meta name="og:site_name" content={title} />
          <meta name="og:locale" content={languageTerritory} />
          <meta name="og:type" content="website" />
        </Head>
        <Wrapper>
          <Header />
          <Content>
            {content}
          </Content>
          <Footer pagination={meta} />
          <Lightbox id={posts.map((post) => post.slug).join('-')} />
        </Wrapper>
      </>
    );
  }
}

IndexPage.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,

  meta: PropTypes.shape({
    currentPage: PropTypes.number,
    totalPages: PropTypes.number,
  }).isRequired,

  error: PropTypes.shape({
    status: PropTypes.number,
  }),
};

IndexPage.defaultProps = {
  error: null,
};

export default withSession(IndexPage);

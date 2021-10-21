import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import { parseCookies } from 'nookies';
import { NextSeo, BlogJsonLd } from 'next-seo';

import { current } from 'config';
import API from 'services/api';

import Wrapper from 'components/Wrapper';
import Header from 'components/Header';
import Content from 'components/Content';
import Footer from 'components/Footer';
import Post from 'components/Post';
import CompactPost from 'components/CompactPost';

const Lightbox = dynamic(() => import('components/ui/Lightbox'), { ssr: false, loading: () => null });

const POSTS_PER_PAGE = 20;

function IndexPage({ posts, meta }) {
  const content = posts.map((post) => {
    if (post.hidden) {
      return (
        <CompactPost
          key={post.slug}
          title={post.title}
          body={post.body}
          slug={post.slug}
          publishedAt={new Date(post.publishedAt)}
          simplified
        />
      );
    }

    return (
      <Post
        cut
        key={post.slug}
        title={post.title}
        body={post.body}
        slug={post.slug}
        language={post.language}
        translations={post.translations}
        commentsCount={post.commentsCount}
        publishedAt={new Date(post.publishedAt)}
        tags={post.tags}
      />
    );
  });

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
      <NextSeo
        title="Скандально довгі тексти"
        description={description}
        keywords={keywords}
        canonical={canonicalUrl}
        openGraph={{
          title,
          description,
          url: current.clientURL,
          locale: languageTerritory,
          site_name: title,
          type: 'website',
        }}
        twitter={{
          handle: social.twitter.username,
          site: social.twitter.username,
          cardType: 'summary',
        }}
      />
      <BlogJsonLd
        url={canonicalUrl}
        title={title}
        description={description}
        authorName="poohitan"
      />
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

export async function getServerSideProps({ query, req, res }) {
  try {
    const { page = 1 } = query;
    const { docs, meta } = await API.posts.find({
      page,
      limit: POSTS_PER_PAGE,
      cut: true,
    }, parseCookies({ req }));

    return {
      props: {
        posts: docs,
        meta,
      },
    };
  } catch (error) {
    const { status = null } = error;

    if (status) {
      res.statusCode = status;
    }

    return {
      props: {
        error: {
          status,
        },
      },
    };
  }
}

IndexPage.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object),

  meta: PropTypes.shape({
    currentPage: PropTypes.number,
    totalPages: PropTypes.number,
  }),
};

IndexPage.defaultProps = {
  posts: [],

  meta: {
    currentPage: 0,
    totalPages: 0,
  },
};

export default IndexPage;

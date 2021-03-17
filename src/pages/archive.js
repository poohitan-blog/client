import React from 'react';
import PropTypes from 'prop-types';
import { NextSeo } from 'next-seo';
import { parseCookies } from 'nookies';

import { current } from 'config';
import API from 'services/api';

import Wrapper from 'components/Wrapper';
import Header from 'components/Header';
import Content from 'components/Content';
import Footer from 'components/Footer';
import CompactPost from 'components/CompactPost';

const POSTS_PER_PAGE = 30;

function ArchivePage({ posts, meta }) {
  const content = posts
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

  const { currentPage } = meta;
  const canonicalUrl = currentPage === 1
    ? `${current.clientURL}/archive`
    : `${current.clientURL}/archive?page=${currentPage}`;

  const description = posts.map((post) => `«${post.title}»`).join(', ');

  return (
    <Wrapper>
      <NextSeo
        title="Архів"
        canonical={canonicalUrl}
        description={`Архів записів — ${description}`}
      />
      <Header />
      <Content>
        <h1>Архів</h1>
        { content }
      </Content>
      <Footer pagination={meta} />
    </Wrapper>
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
    const { statusCode = 500 } = error;

    res.statusCode = statusCode;

    return {
      props: {
        errorCode: statusCode,
      },
    };
  }
}

ArchivePage.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,

  meta: PropTypes.shape({
    currentPage: PropTypes.number,
    totalPages: PropTypes.number,
  }).isRequired,

  error: PropTypes.shape({
    status: PropTypes.number,
  }),
};

ArchivePage.defaultProps = {
  error: null,
};

export default ArchivePage;

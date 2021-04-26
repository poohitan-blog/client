import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { parseCookies } from 'nookies';

import { current } from 'config';
import API from 'services/api';

import Wrapper from 'components/Wrapper';
import Header from 'components/Header';
import Content from 'components/Content';
import Footer from 'components/Footer';
import Post from 'components/Post';
import checkAdminAccess from 'utils/check-admin-access';

const Lightbox = dynamic(() => import('components/ui/Lightbox'), { ssr: false, loading: () => null });

const POSTS_PER_PAGE = 10;

function DraftsPage({ posts, meta }) {
  const content = posts.map((post) => (
    <Post
      cut
      key={post.slug}
      title={post.title}
      body={post.body}
      slug={post.slug}
      hidden
      language={post.language}
      translations={post.translations}
      commentsCount={post.commentsCount}
      publishedAt={new Date(post.publishedAt)}
      tags={post.tags}
    />
  ));

  const { title } = current.meta;

  return (
    <>
      <Head>
        <title>Чернетки</title>
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

export async function getServerSideProps({ query, req, res }) {
  const hasAccess = await checkAdminAccess({ req });

  if (!hasAccess) {
    return {
      props: {
        error: {
          status: 401,
        },
      },
    };
  }

  try {
    const { page = 1 } = query;
    const { docs, meta } = await API.posts.find({
      page,
      limit: POSTS_PER_PAGE,
      cut: true,
      hidden: true,
    }, parseCookies({ req }));

    return {
      props: {
        posts: docs,
        meta,
      },
    };
  } catch (error) {
    const { status } = error;

    res.statusCode = status;

    return {
      props: {
        error: {
          status,
        },
      },
    };
  }
}

DraftsPage.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,

  meta: PropTypes.shape({
    currentPage: PropTypes.number,
    totalPages: PropTypes.number,
  }).isRequired,

  error: PropTypes.shape({
    status: PropTypes.number,
  }),
};

DraftsPage.defaultProps = {
  error: null,
};

export default DraftsPage;

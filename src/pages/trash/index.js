import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import { NextSeo } from 'next-seo';
import { parseCookies } from 'nookies';

import { current } from 'config';
import API from 'services/api';
import { generateTrashPostTitle } from 'services/text';

import Wrapper from 'components/Wrapper';
import Header from 'components/Header';
import Content from 'components/Content';
import Footer from 'components/Footer';
import TrashHeader from 'components/trash/Header';
import TrashPost from 'components/TrashPost';
import Trashbin from 'components/header/Trashbin';

const Lightbox = dynamic(() => import('components/ui/Lightbox'), { ssr: false, loading: () => null });

const POSTS_PER_PAGE = 30;

function generateCanonicalUrl({ posts, meta, single }) {
  const { currentPage } = meta;

  if (single) {
    const [post] = posts;

    return `${current.clientURL}/trash/${post.shortId}`;
  }

  if (currentPage !== 1) {
    return `${current.clientURL}/trash?page=${currentPage}`;
  }

  return `${current.clientURL}/trash`;
}

function TrashPage({ posts, meta, single }) {
  const postsMarkup = posts.map((post) => (
    <TrashPost
      id={post.id}
      shortId={post.shortId}
      key={`${post.id}-${single}`}
      collapsable={!single}
      body={post.body}
      createdAt={new Date(post.createdAt)}
    />
  ));
  const paginationInfo = { ...meta, linkTexts: { next: 'Далі', previous: 'Назад' } };

  const postTitle = single ? generateTrashPostTitle(posts[0].body) : null;

  return (
    <Wrapper>
      <NextSeo
        title={postTitle ? `${postTitle} - Смітник` : 'Смітник'}
        canonical={generateCanonicalUrl({ posts, meta, single })}
      />
      <Header trashBinState={Trashbin.STATES.FULLY_OPEN} />
      <Content>
        <TrashHeader />
        {postsMarkup}
      </Content>
      <Footer pagination={paginationInfo} />
      <Lightbox id={posts.map((post) => post.shortId).join('-')} />
    </Wrapper>
  );
}

export async function getServerSideProps({ query, req, res }) {
  try {
    if (query.id) {
      const posts = [await API.trashPosts.findOne(query.id, parseCookies({ req }))];

      return {
        props: {
          posts,
          single: true,
        },
      };
    }

    if (query.permalink) { // keeps compatibility with old version of links
      const { docs } = await API.trashPosts.find({ permalink: query.permalink }, parseCookies({ req }));

      return {
        props: {
          posts: docs,
          single: true,
        },
      };
    }

    const { page = 1 } = query;
    const { docs, meta } = await API.trashPosts.find({ page, limit: POSTS_PER_PAGE }, parseCookies({ req }));

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

TrashPage.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object),

  error: PropTypes.shape({
    status: PropTypes.number,
  }),

  meta: PropTypes.shape({
    currentPage: PropTypes.number,
    totalPages: PropTypes.number,
  }),

  single: PropTypes.bool,
};

TrashPage.defaultProps = {
  posts: [],
  meta: {},
  error: null,
  single: false,
};

export default TrashPage;

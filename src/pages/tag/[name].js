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
import TagCloud from 'components/TagCloud';

const POSTS_PER_PAGE = 30;

function TagPage({ posts, meta, tag }) {
  const nothingFound = !posts.length;

  function getContent() {
    if (nothingFound) {
      return (
        <div className="text-center">
          <p className="fatty larger">Нічого не знайшлося.</p>
          <p>Хмаринка позначок:</p>
          <TagCloud shake minFontSize={1} maxFontSize={3} width="70%" />
        </div>
      );
    }

    return posts
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
      <NextSeo
        title={`Записи з позначкою «${tag}»`}
        description={`Записи про ${tag}`}
        canonical={canonicalUrl}
      />
      <Header />
      <Content>
        <h1>{`Записи з позначкою «${tag}»`}</h1>
        {
          getContent()
        }
      </Content>
      <Footer pagination={meta} />
    </Wrapper>
  );
}

export async function getServerSideProps({ req, res, query }) {
  try {
    const { name, page = 1 } = query;
    const { docs, meta } = await API.posts.find({
      tag: decodeURIComponent(name),
      page,
      limit: POSTS_PER_PAGE,
      cut: true,
    }, parseCookies({ req }));

    return {
      props: {
        posts: docs,
        meta,
        tag: name,
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

TagPage.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,
  tag: PropTypes.string.isRequired,

  meta: PropTypes.shape({
    currentPage: PropTypes.number,
    totalPages: PropTypes.number,
  }).isRequired,
};

export default TagPage;

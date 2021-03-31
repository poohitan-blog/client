import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Router from 'next/router';
import { parseCookies } from 'nookies';

import API from 'services/api';

import Wrapper from 'components/Wrapper';
import Header from 'components/Header';
import Content from 'components/Content';
import PostForm from 'components/admin/PostForm';
import checkAdminAccess from 'utils/check-admin-access';

function EditPost({ post, tagCloud }) {
  const title = post.id ? 'Редагувати запис' : 'Додати запис';

  async function submit(submittedPost) {
    const savedPost = submittedPost.id
      ? await API.posts.update(post.slug, submittedPost, parseCookies({}))
      : await API.posts.create(submittedPost, parseCookies({}));

    Router.push('/p/[slug]', `/p/${savedPost.slug}`);
  }

  return (
    <Wrapper>
      <Head>
        <title>{title}</title>
      </Head>
      <Header />
      <Content>
        <PostForm
          key={post.slug}
          id={post.id}
          title={post.title}
          slug={post.slug}
          description={post.description}
          body={post.body}
          tags={post.tags}
          tagCloud={tagCloud}
          customStyles={post.customStyles}
          imagesWidth={post.imagesWidth}
          hidden={post.hidden}
          publishedAt={new Date(post.publishedAt)}
          translations={post.translations}
          onChange={submit}
        />
      </Content>
    </Wrapper>
  );
}

export async function getServerSideProps({ req, res, query }) {
  try {
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

    const tagCloud = await API.tags.getCloud();

    if (!query.slug) {
      return {
        props: {
          tagCloud,
        },
      };
    }

    const post = await API.posts.findOne(query.slug, parseCookies({ req }));

    return {
      props: {
        post,
        tagCloud,
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

EditPost.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string,
    slug: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    body: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    customStyles: PropTypes.string,
    imagesWidth: PropTypes.number,
    hidden: PropTypes.bool,
    publishedAt: PropTypes.string,
    translations: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  tagCloud: PropTypes.shape({}).isRequired,
};

EditPost.defaultProps = {
  post: {},
};

export default EditPost;

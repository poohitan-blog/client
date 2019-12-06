import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Router from 'next/router';

import API from '../../services/api';
import Error from '../_error';
import { getAllCookies } from '../../services/cookies';

import ProtectedPage from '../_protected';
import Wrapper from '../../components/Wrapper';
import Header from '../../components/Header';
import Content from '../../components/Content';
import PostForm from '../../components/admin/PostForm';

class EditPost extends ProtectedPage {
  static async getInitialProps({ req, query }) {
    try {
      const parentProps = await super.getInitialProps({ req });
      const tagCloud = await API.tags.getCloud();

      if (!query.path) {
        return { ...parentProps, tagCloud };
      }

      const post = await API.posts.findOne(query.path, getAllCookies(req));

      return { ...parentProps, post, tagCloud };
    } catch (error) {
      return { error };
    }
  }

  constructor(props) {
    super(props);

    this.submit = this.submit.bind(this);
  }

  async submit(post) {
    const savedPost = post.id
      ? await API.posts.update(this.props.post.path, post, getAllCookies())
      : await API.posts.create(post, getAllCookies());

    Router.push(`/post?path=${savedPost.path}`, `/p/${savedPost.path}`);
  }

  render() {
    const { post, tagCloud, error } = this.props;

    if (error) {
      return <Error statusCode={error.status} />;
    }

    const title = post.id ? 'Редагувати запис' : 'Додати запис';

    return (
      <Wrapper>
        <Head>
          <title>{title}</title>
        </Head>
        <Header />
        <Content>
          <PostForm
            key={post.path}
            id={post.id}
            title={post.title}
            path={post.path}
            description={post.description}
            body={post.body}
            tags={post.tags}
            tagCloud={tagCloud}
            customStyles={post.customStyles}
            imagesWidth={post.imagesWidth}
            private={post.private}
            publishedAt={new Date(post.publishedAt)}
            translations={post.translations}
            onChange={(value) => this.submit(value)}
          />
        </Content>
      </Wrapper>
    );
  }
}

EditPost.propTypes = {
  post: PropTypes.shape({}),
  tagCloud: PropTypes.shape({}).isRequired,
};

EditPost.defaultProps = {
  post: {},
};

export default EditPost;

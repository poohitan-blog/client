import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Router from 'next/router';

import API from '../../services/api';
import Error from '../_error';
import { getAllCookies } from '../../services/cookies';

import ProtectedPage from '../mixins/protected';
import Wrapper from '../../components/Wrapper';
import Header from '../../components/Header';
import Content from '../../components/Content';
import PostForm from '../../components/admin/PostForm';

class EditPost extends ProtectedPage {
  static async getInitialProps({ req, query }) {
    try {
      const parentProps = await super.getInitialProps({ req });

      if (!query.path) {
        return parentProps;
      }

      const post = await API.posts.findOne(query.path, getAllCookies(req));

      return Object.assign(parentProps, { post });
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
    if (this.props.error) {
      return <Error statusCode={this.props.error.status} />;
    }

    const title = this.props.post.path ? 'Редагувати запис' : 'Додати запис';

    return (
      <Wrapper>
        <Head>
          <title>{title}</title>
        </Head>
        <Header />
        <Content>
          <PostForm {...this.props.post} key={this.props.post.path} onChange={post => this.submit(post)} />
        </Content>
      </Wrapper>
    );
  }
}

EditPost.propTypes = {
  post: PropTypes.shape({}),
};

EditPost.defaultProps = {
  post: {},
};

export default EditPost;

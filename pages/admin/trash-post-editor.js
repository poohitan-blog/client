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

import Editor from '../../utils/editor';

class TrashPostEditor extends ProtectedPage {
  static async getInitialProps({ req, query }) {
    try {
      const parentProps = await super.getInitialProps({ req });

      if (!query.id) {
        return parentProps;
      }

      const trashPost = await API.trashPosts.findOne(query.id, getAllCookies(req));

      return Object.assign(parentProps, { trashPost });
    } catch (error) {
      return { error };
    }
  }

  constructor(props) {
    super(props);

    this.state = props.trashPost || {};
    this.submit = this.submit.bind(this);
  }

  async submit() {
    if (!this.state.body) {
      // TODO: show error popup

      return;
    }

    const postId = this.props.trashPost.id;

    if (postId) {
      const updatedPost = await API.trashPosts.update(postId, this.state, getAllCookies());

      Router.push(`/trash?id=${updatedPost.id}`, `/trash/${updatedPost.id}`);

      return;
    }

    const newPost = await API.trashPosts.create(this.state, getAllCookies());

    Router.push(`/trash?id=${newPost.id}`, `/trash/${newPost.id}`);
  }

  render() {
    if (this.props.error) {
      return <Error statusCode={this.props.error.status} />;
    }

    const title = this.props.trashPost.id ? 'Редагувати запис' : 'Додати запис у смітник';

    return (
      <Wrapper>
        <Head>
          <title>{title}</title>
        </Head>
        <Header />
        <Content>
          <div className="children-equal-margin-vertical layout-row layout-wrap">
            <h1>{title}</h1>
            <div className="flex-100">
              <Editor key={this.props.trashPost.id} html={this.state.body} onChange={body => this.setState({ body })} />
            </div>
            <div className="layout-row layout-align-center-center flex-100">
              <button onClick={this.submit} className="flex-30">Вйо</button>
            </div>
          </div>
        </Content>
      </Wrapper>
    );
  }
}

TrashPostEditor.propTypes = {
  trashPost: PropTypes.shape({}),
};

TrashPostEditor.defaultProps = {
  trashPost: {},
};

export default TrashPostEditor;

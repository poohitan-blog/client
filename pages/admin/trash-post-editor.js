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
import TrashPostForm from '../../components/admin/TrashPostForm';

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

  async submit(trashPost) {
    const savedTrashPost = trashPost.id
      ? await API.trashPosts.update(this.props.trashPost.id, trashPost, getAllCookies())
      : await API.trashPosts.create(trashPost, getAllCookies());

    Router.push(`/trash?id=${savedTrashPost.id}`, `/trash/${savedTrashPost.id}`);
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
          <TrashPostForm
            {...this.props.trashPost}
            key={this.props.trashPost.id}
            onChange={trashPost => this.submit(trashPost)}
          />
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

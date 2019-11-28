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

class EditTrashPost extends ProtectedPage {
  static async getInitialProps({ req, query }) {
    try {
      const parentProps = await super.getInitialProps({ req });

      if (!query.id) {
        return parentProps;
      }

      const trashPost = await API.trashPosts.findOne(query.id, getAllCookies(req));

      return { ...parentProps, trashPost };
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
    const { trashPost, error } = this.props;

    if (this.props.error) {
      return <Error statusCode={error.status} />;
    }

    const title = trashPost.id ? 'Редагувати запис' : 'Додати запис у смітник';

    return (
      <Wrapper>
        <Head>
          <title>{title}</title>
        </Head>
        <Header />
        <Content>
          <TrashPostForm
            id={trashPost.id}
            body={trashPost.body}
            key={trashPost.id}
            onChange={(value) => this.submit(value)}
          />
        </Content>
      </Wrapper>
    );
  }
}

EditTrashPost.propTypes = {
  trashPost: PropTypes.shape({}),
};

EditTrashPost.defaultProps = {
  trashPost: {},
};

export default EditTrashPost;

import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Router from 'next/router';

import API from '../../../services/api';
import Error from '../../_error';
import { getAllCookies } from '../../../services/cookies';

import withSession from '../../../hocs/withSession';
import withProtection from '../../../hocs/withProtection';
import Wrapper from '../../../components/Wrapper';
import Header from '../../../components/Header';
import Content from '../../../components/Content';
import TrashPostForm from '../../../components/admin/TrashPostForm';

class EditTrashPost extends React.Component {
  static async getInitialProps({ req, query }) {
    try {
      if (!query.id) {
        return {};
      }

      const trashPost = await API.trashPosts.findOne(query.id, getAllCookies(req));

      return { trashPost };
    } catch (error) {
      return { error };
    }
  }

  constructor(props) {
    super(props);

    this.state = props.trashPost || {};
    this.submit = this.submit.bind(this);
  }

  async submit(submittedTrashPost) {
    const { trashPost } = this.props;

    const savedTrashPost = submittedTrashPost.id
      ? await API.trashPosts.update(trashPost.id, submittedTrashPost, getAllCookies())
      : await API.trashPosts.create(submittedTrashPost, getAllCookies());

    Router.push(`/trash?id=${savedTrashPost.id}`, `/trash/${savedTrashPost.id}`);
  }

  render() {
    const { trashPost, error } = this.props;

    if (error) {
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
  trashPost: PropTypes.shape({
    id: PropTypes.string,
    body: PropTypes.string,
  }),
  error: PropTypes.shape({
    status: PropTypes.number,
  }),
};

EditTrashPost.defaultProps = {
  trashPost: {},
  error: null,
};

export default withProtection(withSession(EditTrashPost));

import React from 'react';
import PropTypes from 'prop-types';
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
    if (this.props.trashPost.id) {
      const updatedTrashPost = await API.trashPosts.update(this.props.trashPost.id, this.state, getAllCookies());

      Router.push(`/trash?id=${updatedTrashPost.id}`, `/trash/${updatedTrashPost.id}`);

      return;
    }

    const newTrashPost = await API.trashPosts.create(this.state, getAllCookies());

    Router.push(`/trash?id=${newTrashPost.id}`, `/trash/${newTrashPost.id}`);
  }

  render() {
    if (this.props.error) {
      return <Error statusCode={this.props.error.status} />;
    }

    return (
      <Wrapper>
        <Header />
        <Content>
          <div className="children-equal-margin-vertical layout-row layout-wrap">
            <div className="flex-100">
              <Editor html={this.state.body} onChange={body => this.setState({ body })} />
            </div>
            <button onClick={this.submit}>Вйо</button>
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

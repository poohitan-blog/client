import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Router from 'next/router';

import API from '../../services/api';
import Error from '../_error';
import { getAllCookies } from '../../services/cookies';
import config from '../../config';

import ProtectedPage from '../_protected';
import Wrapper from '../../components/Wrapper';
import Header from '../../components/Header';
import Content from '../../components/Content';

import Editor from '../../utils/editor';

class PostEditor extends ProtectedPage {
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

    this.state = props.post || {};

    this.handleTagsChange = this.handleTagsChange.bind(this);
    this.getPostLinkMarkup = this.getPostLinkMarkup.bind(this);
    this.submit = this.submit.bind(this);
  }

  handleTagsChange(event) {
    const tagsString = event.target.value;
    const tags = tagsString.split(',').map(tag => tag.trim());

    this.setState({ tags });
  }

  async submit() {
    if (this.props.post.path) {
      const updatedPost = await API.posts.update(this.props.post.path, this.state, getAllCookies());

      Router.push(`/post?path=${updatedPost.path}`, `/p/${updatedPost.path}`);

      return;
    }

    const newPost = await API.posts.create(this.state, getAllCookies());

    Router.push(`/post?path=${newPost.path}`, `/p/${newPost.path}`);
  }

  getPostLinkMarkup() {
    const prefix = `${config.current.clientURL}/p`;
    const path = this.props.post.path || this.state.path || '';
    const fullLink = `${prefix}/${path}`;
    const isNewPost = !this.props.post.path;

    if (isNewPost) {
      return <span>{fullLink}</span>;
    }

    return <Link as={`/p/${path}`} href={`/post?path=${path}`}><a>{fullLink}</a></Link>;
  }

  render() {
    if (this.props.error) {
      return <Error statusCode={this.props.error.status} />;
    }

    const link = this.getPostLinkMarkup();
    const tags = this.state.tags ? this.state.tags.join(', ') : '';

    return (
      <Wrapper>
        <Header />
        <Content>
          <div className="children-equal-margin-vertical layout-row layout-wrap">
            <input
              type="text"
              placeholder="Назва"
              value={this.state.title}
              onChange={event => this.setState({ title: event.target.value })}
              className="flex-100"
            />
            <div className="smaller layout-row layout-align-start-center flex-100">
              <input
                type="text"
                value={this.state.path}
                placeholder="Адреса"
                onChange={event => this.setState({ path: event.target.value })}
                className="flex-50"
              />
              <div className="nowrap text-overflow-ellipsis margin-left flex-50">
                {link}
              </div>
            </div>
            <div className="flex-100">
              <Editor html={this.state.body} onChange={body => this.setState({ body })} />
            </div>
            <div className="children-equal-margin-vertical layout-row layout-wrap layout-align-center-center flex-100">
              <span>Теґи (через кому):</span>
              <input
                type="text"
                value={tags}
                onChange={this.handleTagsChange}
                className="flex-100"
              />
            </div>
            <button onClick={this.submit}>Вйо</button>
          </div>
        </Content>
      </Wrapper>
    );
  }
}

PostEditor.propTypes = {
  post: PropTypes.shape({}),
};

PostEditor.defaultProps = {
  post: {},
};

export default PostEditor;

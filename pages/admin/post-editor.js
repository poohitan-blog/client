import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';
import moment from 'moment';

import API from '../../services/api';
import Error from '../_error';
import { getAllCookies } from '../../services/cookies';
import { current } from '../../config';

import ProtectedPage from '../_protected';
import Wrapper from '../../components/Wrapper';
import Header from '../../components/Header';
import Content from '../../components/Content';
import Checkbox from '../../components/ui/Checkbox';

import Editor from '../../utils/editor';

const DATE_FORMAT = 'DD.MM.YYYY HH:mm';

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
    this.state.tagsString = props.post.tags && props.post.tags.length ? props.post.tags.join(', ') : '';
    this.state.dateString = props.post.publishedAt ? moment(props.post.publishedAt).format(DATE_FORMAT) : '';

    this.handleTagsChange = this.handleTagsChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.getPostLinkMarkup = this.getPostLinkMarkup.bind(this);
    this.submit = this.submit.bind(this);
  }

  handleTagsChange(event) {
    const tagsString = event.target.value;

    this.setState({
      tagsString,
      tags: tagsString.split(',').map(tag => tag.trim()),
    });
  }

  handleDateChange(event) {
    const dateString = event.target.value;
    const date = moment(dateString, DATE_FORMAT).toDate();

    this.setState({
      dateString,
      publishedAt: date,
    });
  }

  async submit() {
    if (this.props.post.path) {
      const updatedPost = await API.posts.update(this.props.post.path, this.state, getAllCookies());

      Router.push(`/post?path=${updatedPost.path}`, `/p/${updatedPost.path}`);

      return;
    }

    if (!(this.state.title && this.state.body)) {
      // TODO: show error popup

      return;
    }

    const newPost = await API.posts.create(this.state, getAllCookies());

    Router.push(`/post?path=${newPost.path}`, `/p/${newPost.path}`);
  }

  getPostLinkMarkup() {
    const prefix = `${current.clientURL}/p`;
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

    const title = this.props.post.path ? 'Редагувати запис' : 'Додати запис';
    const link = this.getPostLinkMarkup();

    return (
      <Wrapper>
        <Head>
          <title>{title}</title>
        </Head>
        <Header />
        <Content>
          <div className="children-equal-margin-vertical layout-row layout-wrap">
            <h1>{title}</h1>
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
                value={this.state.tagsString}
                onChange={this.handleTagsChange}
                className="flex-100"
              />
            </div>
            <div className="layout-row layout-align-space-between-center flex-100">
              <div className="layout-row layout-align-start-center flex-50">
                <input
                  type="text"
                  placeholder="DD.MM.YYYY HH:mm"
                  value={this.state.dateString}
                  onChange={this.handleDateChange}
                  pattern="[0-3][0-9]\.[0-1][0-9]\.[1-2][0-9][0-9][0-9] [0-2][0-9]:[0-5][0-9]"
                  className="text-center flex-50"
                />
                <div className="flex-offset-5">
                  <Checkbox
                    label="Заховати"
                    checked={this.state.private}
                    onChange={hidden => this.setState({ private: hidden })}
                  />
                </div>
              </div>
              <button onClick={this.submit} className="flex-30">Вйо</button>
            </div>
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

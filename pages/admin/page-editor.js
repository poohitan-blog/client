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

class PageEditor extends ProtectedPage {
  static async getInitialProps({ req, query }) {
    try {
      const parentProps = await super.getInitialProps({ req });

      if (!query.path) {
        return parentProps;
      }

      const page = await API.pages.findOne(query.path, getAllCookies(req));

      return Object.assign(parentProps, { page });
    } catch (error) {
      return { error };
    }
  }

  constructor(props) {
    super(props);

    this.state = props.page || {};

    this.getPageLinkMarkup = this.getPageLinkMarkup.bind(this);
    this.submit = this.submit.bind(this);
  }

  async submit() {
    if (this.props.page.path) {
      const updatedPage = await API.pages.update(this.props.page.path, this.state, getAllCookies());

      Router.push(`/page?path=${updatedPage.path}`, `/${updatedPage.path}`);

      return;
    }

    const newPage = await API.pages.create(this.state, getAllCookies());

    Router.push(`/page?path=${newPage.path}`, `/${newPage.path}`);
  }

  getPageLinkMarkup() {
    const prefix = `${config.current.clientURL}`;
    const path = this.props.page.path || this.state.path || '';
    const fullLink = `${prefix}/${path}`;
    const isNewpage = !this.props.page.path;

    if (isNewpage) {
      return <span>{fullLink}</span>;
    }

    return <Link as={`/${path}`} href={`/page?path=${path}`}><a>{fullLink}</a></Link>;
  }

  render() {
    if (this.props.error) {
      return <Error statusCode={this.props.error.status} />;
    }

    const link = this.getPageLinkMarkup();

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
            <button onClick={this.submit}>Вйо</button>
          </div>
        </Content>
      </Wrapper>
    );
  }
}

PageEditor.propTypes = {
  page: PropTypes.shape({}),
};

PageEditor.defaultProps = {
  page: {},
};

export default PageEditor;

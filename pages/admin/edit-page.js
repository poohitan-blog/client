import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';

import API from '../../services/api';
import Error from '../_error';
import { getAllCookies } from '../../services/cookies';
import { current } from '../../config';

import ProtectedPage from '../_protected';
import Wrapper from '../../components/Wrapper';
import Header from '../../components/Header';
import Content from '../../components/Content';
import PageForm from '../../components/admin/PageForm';

class EditPage extends ProtectedPage {
  static async getInitialProps({ req, query }) {
    try {
      const parentProps = await super.getInitialProps({ req });

      if (!query.path) {
        return parentProps;
      }

      const page = await API.pages.findOne(query.path, getAllCookies(req));

      return { ...parentProps, page };
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

  async submit(page) {
    const savedPage = page.id
      ? await API.pages.update(this.props.page.path, page, getAllCookies())
      : await API.pages.create(page, getAllCookies());

    Router.push(`/page?path=${savedPage.path}`, `/${savedPage.path}`);
  }

  getPageLinkMarkup() {
    const prefix = `${current.clientURL}`;
    const path = this.props.page.path || this.state.path || '';
    const fullLink = `${prefix}/${path}`;
    const isNewpage = !this.props.page.path;

    if (isNewpage) {
      return <span>{fullLink}</span>;
    }

    return <Link as={`/${path}`} href={`/page?path=${path}`}><a>{fullLink}</a></Link>;
  }

  render() {
    const { page, error } = this.props;

    if (error) {
      return <Error statusCode={error.status} />;
    }

    const title = page.id ? 'Редагувати сторінку' : 'Додати сторінку';

    return (
      <Wrapper>
        <Head>
          <title>{title}</title>
        </Head>
        <Header />
        <Content>
          <PageForm
            id={page.id}
            title={page.title}
            body={page.body}
            path={page.path}
            private={page.private}
            customStyles={page.customStyles}
            key={page.path}
            onChange={(value) => this.submit(value)}
          />
        </Content>
      </Wrapper>
    );
  }
}

EditPage.propTypes = {
  page: PropTypes.shape({}),
};

EditPage.defaultProps = {
  page: {},
};

export default EditPage;

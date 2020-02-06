import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';

import API from '../../services/api';
import Error from '../_error';
import { getAllCookies } from '../../services/cookies';
import { current } from '../../config';

import withSession from '../../hocs/withSession';
import withProtection from '../../hocs/withProtection';
import Wrapper from '../../components/Wrapper';
import Header from '../../components/Header';
import Content from '../../components/Content';
import PageForm from '../../components/admin/PageForm';

class EditPage extends React.Component {
  static async getInitialProps({ req, query }) {
    try {
      if (!query.path) {
        return {};
      }

      const page = await API.pages.findOne(query.path, getAllCookies(req));

      return { page };
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

  getPageLinkMarkup() {
    const { page } = this.props;
    const { path: currentPath } = page;
    const { path: newPath } = this.state;

    const prefix = `${current.clientURL}`;
    const path = currentPath || newPath || '';
    const fullLink = `${prefix}/${path}`;
    const isNewpage = !currentPath;

    if (isNewpage) {
      return <span>{fullLink}</span>;
    }

    return <Link as={`/${path}`} href={`/page?path=${path}`}><a>{fullLink}</a></Link>;
  }

  async submit(submittedPage) {
    const { page } = this.props;

    const savedPage = page.id
      ? await API.pages.update(page.path, submittedPage, getAllCookies())
      : await API.pages.create(submittedPage, getAllCookies());

    Router.push(`/page?path=${savedPage.path}`, `/${savedPage.path}`);
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
  page: PropTypes.shape({
    id: PropTypes.string,
    path: PropTypes.string,
    title: PropTypes.string,
    body: PropTypes.string,
    private: PropTypes.bool,
    customStyles: PropTypes.string,
  }),

  error: PropTypes.shape({
    status: PropTypes.number,
  }),
};

EditPage.defaultProps = {
  page: {},
  error: null,
};

export default withProtection(withSession(EditPage));

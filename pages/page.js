import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Error from './_error';
import { current } from '../config';
import API from '../services/api';
import { getAllCookies } from '../services/cookies';
import * as Text from '../services/text';

import AuthenticatablePage from './_authenticatable';
import Wrapper from '../components/Wrapper';
import Header from '../components/Header';
import Content from '../components/Content';
import Footer from '../components/Footer';
import Page from '../components/Page';
import TagCloud from '../components/TagCloud';

class PagePage extends AuthenticatablePage {
  static async getInitialProps({ query, req }) {
    try {
      const parentProps = await super.getInitialProps({ req });
      const page = await API.pages.findOne(query.path, getAllCookies(req));

      return Object.assign(parentProps, { page });
    } catch (error) {
      return { error };
    }
  }

  render() {
    if (this.props.error) {
      return <Error statusCode={this.props.error.status} />;
    }

    const { page } = this.props;

    return (
      <Wrapper>
        <Head>
          <title>{page.title} - {current.meta.title}</title>
          <meta name="description" content={Text.stripHTML(Text.shorten(page.body, 60))} key="description" />
        </Head>
        <Header />
        <Content>
          <Page {...page} key={page.path} />
        </Content>
        <Footer />
      </Wrapper>
    );
  }
}

PagePage.propTypes = {
  page: PropTypes.shape({
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
  }),

  error: PropTypes.shape({
    status: PropTypes.number,
  }),
};

PagePage.defaultProps = {
  page: {},
  error: null,
};

export default PagePage;

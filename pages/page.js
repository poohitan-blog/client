import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Error from './_error';
import API from '../services/api';
import { getAllCookies } from '../services/cookies';

import AuthenticatablePage from './_authenticatable';
import Wrapper from '../components/Wrapper';
import Header from '../components/Header';
import Content from '../components/Content';
import Footer from '../components/Footer';

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

    const title = this.props.page.title ? <h1>{this.props.page.title}</h1> : null;

    return (
      <Wrapper>
        <Head>
          <title>{this.props.page.title} - poohitan</title>
        </Head>
        <Header />
        <Content>
          {title}
          <div dangerouslySetInnerHTML={{ __html: this.props.page.body }} />
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

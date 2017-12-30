import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Error from './_error';
import API from '../services/api';
import { getAllCookies } from '../services/cookies';
import Session from '../services/session';

import Wrapper from '../components/Wrapper';
import Header from '../components/Header';
import Content from '../components/Content';
import Footer from '../components/Footer';

class PagePage extends React.Component {
  static async getInitialProps({ query, req }) {
    try {
      const isAuthenticated = Session.isAuthenticated(req);
      const page = await API.pages.findOne(query.path, getAllCookies(req));

      return { page, isAuthenticated };
    } catch (error) {
      return { error };
    }
  }

  getChildContext() {
    return { isAuthenticated: this.props.isAuthenticated };
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
  isAuthenticated: PropTypes.bool.isRequired,

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

PagePage.childContextTypes = {
  isAuthenticated: PropTypes.bool,
};

export default PagePage;

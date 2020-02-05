import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

import Error from './_error';
import { current } from '../config';
import API from '../services/api';
import { getAllCookies } from '../services/cookies';
import { stripHTML, shorten } from '../services/text';

import AuthenticatablePage from './_authenticatable';
import Wrapper from '../components/Wrapper';
import Header from '../components/Header';
import Content from '../components/Content';
import Footer from '../components/Footer';
import Page from '../components/Page';

class PagePage extends AuthenticatablePage {
  static async getInitialProps({ query, req, pathname }) {
    try {
      const parentProps = await super.getInitialProps({ req });
      const page = await API.pages.findOne(query.path, getAllCookies(req));

      return { ...parentProps, page, pathname };
    } catch (error) {
      return { error };
    }
  }

  render() {
    if (this.props.error) {
      return <Error statusCode={this.props.error.status} />;
    }

    const { page, pathname } = this.props;

    return (
      <Wrapper pathname={pathname}>
        <Head>
          <title>{`${page.title} - ${current.meta.title}`}</title>
          <link rel="canonical" href={`${current.clientURL}/${page.path}`} />

          <meta name="description" content={shorten(stripHTML(page.body), 20)} key="description" />
        </Head>
        { page.customStylesProcessed && <style dangerouslySetInnerHTML={{ __html: page.customStylesProcessed }} /> }
        <Header />
        <Content>
          <Page
            key={page.path}
            path={page.path}
            title={page.title}
            body={page.body}
            private={page.private}
          />
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

import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { parseCookies } from 'nookies';

import Error from './_error';
import { current } from '../config';
import API from '../services/api';
import { stripHTML, shorten } from '../services/text';

import withSession from '../hocs/withSession';
import Wrapper from '../components/Wrapper';
import Header from '../components/Header';
import Content from '../components/Content';
import Footer from '../components/Footer';
import Page from '../components/Page';

class PagePage extends React.Component {
  static async getInitialProps({ query, req, pathname }) {
    try {
      const page = await API.pages.findOne(query.slug, parseCookies({ req }));

      return { page, pathname };
    } catch (error) {
      return { error };
    }
  }

  render() {
    const { page, pathname, error } = this.props;

    if (error) {
      return <Error statusCode={error.status} />;
    }

    return (
      <Wrapper pathname={pathname}>
        <Head>
          <title>{`${page.title} - ${current.meta.title}`}</title>
          <link rel="canonical" href={`${current.clientURL}/${page.slug}`} />

          <meta name="description" content={shorten(stripHTML(page.body), 20)} key="description" />
        </Head>
        {
          page.customStylesProcessed && <style dangerouslySetInnerHTML={{ __html: page.customStylesProcessed }} />
        }
        <Header />
        <Content>
          <Page
            key={page.slug}
            slug={page.slug}
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
  pathname: PropTypes.string.isRequired,

  page: PropTypes.shape({
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    private: PropTypes.bool,
    customStylesProcessed: PropTypes.string,
  }),

  error: PropTypes.shape({
    status: PropTypes.number,
  }),
};

PagePage.defaultProps = {
  page: {},
  error: null,
};

export default withSession(PagePage);

import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { parseCookies } from 'nookies';

import { current } from 'Config';
import Error from 'Pages/_error';
import API from 'Services/api';
import { stripHTML, shorten } from 'Services/text';

import withSession from 'Hocs/withSession';
import Wrapper from 'Components/Wrapper';
import Header from 'Components/Header';
import Content from 'Components/Content';
import Footer from 'Components/Footer';
import Page from 'Components/Page';

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
    const { page, error } = this.props;

    if (error) {
      return <Error statusCode={error.status} />;
    }

    return (
      <Wrapper>
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
            hidden={page.hidden}
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
    slug: PropTypes.string.isRequired,
    hidden: PropTypes.bool,
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
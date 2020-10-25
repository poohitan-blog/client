import React from 'react';
import PropTypes from 'prop-types';
import { parseCookies } from 'nookies';
import { NextSeo } from 'next-seo';

import { current } from 'config';
import Error from 'pages/_error';
import API from 'services/api';
import { stripHTML, shorten } from 'services/text';

import withSession from 'hocs/withSession';
import Wrapper from 'components/Wrapper';
import Header from 'components/Header';
import Content from 'components/Content';
import Footer from 'components/Footer';
import Page from 'components/Page';

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
        <NextSeo
          title={page.title}
          description={shorten(stripHTML(page.body), 20)}
          canonical={`${current.clientURL}/${page.slug}`}
        />
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

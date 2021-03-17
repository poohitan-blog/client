import React from 'react';
import PropTypes from 'prop-types';
import { parseCookies } from 'nookies';
import { NextSeo } from 'next-seo';

import { current } from 'config';
import API from 'services/api';
import { stripHTML, shorten } from 'services/text';

import Wrapper from 'components/Wrapper';
import Header from 'components/Header';
import Content from 'components/Content';
import Footer from 'components/Footer';
import Page from 'components/Page';

function PagePage({ page }) {
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

export async function getServerSideProps({ query, req, res }) {
  try {
    const page = await API.pages.findOne(query.slug, parseCookies({ req }));

    return {
      props: {
        page,
      },
    };
  } catch (error) {
    const { statusCode = 500 } = error;

    res.statusCode = statusCode;

    return {
      props: {
        errorCode: statusCode,
      },
    };
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
};

PagePage.defaultProps = {
  page: {},
};

export default PagePage;

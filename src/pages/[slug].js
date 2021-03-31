import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
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
import PageFallback from 'components/PageFallback';

function PagePage({ page }) {
  const router = useRouter();

  if (router.isFallback) {
    return <PageFallback />;
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

export async function getStaticProps({ params }) {
  try {
    const page = await API.pages.findOne(params.slug, parseCookies({}));

    return {
      props: {
        page,
      },
      revalidate: 1,
    };
  } catch (error) {
    const { status } = error;

    return {
      props: {
        error: {
          status,
        },
      },
    };
  }
}

export async function getStaticPaths() {
  const { docs: pages } = await API.pages.find({ hidden: false });

  const paths = pages.map((page) => ({
    params: {
      slug: page.slug,
    },
  }));

  return {
    paths,
    fallback: true,
  };
}

export default PagePage;

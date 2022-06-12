import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { parseCookies } from 'nookies';
import { NextSeo } from 'next-seo';

import { current } from 'config';
import API from 'services/api';
import { stripHTML, shorten, getImageLinksFromHTML } from 'services/text';

import Wrapper from 'components/Wrapper';
import Header from 'components/Header';
import Content from 'components/Content';
import Footer from 'components/Footer';
import Page from 'components/Page';
import PageFallback from 'components/PageFallback';

const Lightbox = dynamic(() => import('components/ui/Lightbox'), { ssr: false, loading: () => null });
function PagePage({ page }) {
  const router = useRouter();

  if (router.isFallback) {
    return <PageFallback />;
  }

  const {
    title, body, slug, createdAt,
  } = page;
  const description = shorten(stripHTML(body), 20);
  const [image] = getImageLinksFromHTML(body);
  const datePublished = new Date(createdAt).toISOString();

  const url = `${current.clientURL}/${slug}`;

  return (
    <Wrapper>
      <NextSeo
        title={title}
        description={description}
        canonical={url}
        openGraph={{
          title,
          description,
          url,
          type: 'article',
          article: {
            publishedTime: datePublished,
          },
          images: [{
            url: image,
          }],
        }}
        twitter={{
          handle: current.meta.social.twitter.username,
          site: current.meta.social.twitter.username,
          cardType: 'summary',
        }}
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
      <Lightbox id={page.slug} />
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
    createdAt: PropTypes.string,
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

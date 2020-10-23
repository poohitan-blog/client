import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import { NextSeo, ArticleJsonLd } from 'next-seo';
import { parseCookies } from 'nookies';

import { current } from 'config';
import Error from 'pages/_error';
import API from 'services/api';
import { stripHTML, getImageLinksFromHTML, shorten } from 'services/text';

import withSession from 'hocs/withSession';
import Wrapper from 'components/Wrapper';
import Header from 'components/Header';
import Content from 'components/Content';
import Footer from 'components/Footer';
import Post from 'components/Post';
import CommentForm from 'components/post/comments/Form';

const SimilarPostsGroup = dynamic(() => import('components/SimilarPostsGroup'), {
  ssr: false,
  loading: () => null,
});
const Lightbox = dynamic(() => import('components/ui/Lightbox'), { ssr: false, loading: () => null });

class PostPage extends React.Component {
  static async getInitialProps({
    query, req, res, pathname,
  }) {
    try {
      const post = await API.posts.findOne(query.slug, parseCookies({ req }));
      const similarPosts = await API.posts.findSimilar(query.slug);

      const availableLanguages = post.translations.map((item) => item.lang);
      const requestedLanguage = query.language;

      if (requestedLanguage && !availableLanguages.includes(requestedLanguage)) {
        return res
          .writeHead(302, {
            Location: `/p/${post.slug}`,
          })
          .end();
      }

      return {
        post,
        similarPosts,
        pathname,
        language: requestedLanguage,
      };
    } catch (error) {
      return { error };
    }
  }

  render() {
    const {
      post,
      similarPosts,
      language,
      error,
    } = this.props;

    if (error) {
      return <Error statusCode={error.status} />;
    }

    const translation = (language && post.translations.find((item) => item.lang === language)) || {};
    const isTranslation = Boolean(translation.lang);

    const title = `${translation.title || post.title}`;
    const body = translation.body || post.body;
    const images = getImageLinksFromHTML(body).slice(0, 10);
    const description = translation.description
      || post.description
      || shorten(stripHTML(body), 20);
    const datePublished = new Date(post.publishedAt).toISOString();

    const url = isTranslation
      ? `${current.clientURL}/p/${post.slug}/${language}`
      : `${current.clientURL}/p/${post.slug}`;

    return (
      <>
        <NextSeo
          title={title}
          description={description}
          keywords={post.tags.join(', ')}
          canonical={url}
          openGraph={{
            title,
            description,
            url,
            type: 'article',
            article: {
              publishedTime: datePublished,
              tags: post.tags,
            },
            images: images.map((image) => ({
              url: image,
            })),
          }}
          twitter={{
            handle: current.meta.social.twitter.username,
            site: current.meta.social.twitter.username,
            cardType: 'summary',
          }}
        />
        <ArticleJsonLd
          url={url}
          title={title}
          description={description}
          images={images}
          datePublished={datePublished}
          dateModified={datePublished}
        />
        <Wrapper>
          <Header />
          {
            post.customStylesProcessed && <style dangerouslySetInnerHTML={{ __html: post.customStylesProcessed }} />
          }
          <Content>
            <Post
              key={post.slug}
              title={post.title}
              body={post.body}
              slug={post.slug}
              hidden={post.hidden}
              language={language}
              translations={post.translations}
              tags={post.tags}
              commentsCount={post.commentsCount}
              publishedAt={new Date(post.publishedAt)}
              imagesWidth={post.imagesWidth}
            />
            {
              similarPosts.length ? <SimilarPostsGroup posts={similarPosts} displayCount={3} /> : null
            }
            <CommentForm title={post.title} slug={post.slug} />
          </Content>
          <Footer />
          <Lightbox id={[post.slug, language].join('-')} />
        </Wrapper>
      </>
    );
  }
}

PostPage.propTypes = {
  language: PropTypes.string,

  post: PropTypes.shape({
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    description: PropTypes.string,
    slug: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string),
    publishedAt: PropTypes.instanceOf(Date),
    hidden: PropTypes.bool,
    commentsCount: PropTypes.number,
    translations: PropTypes.arrayOf(PropTypes.shape({})),
    customStylesProcessed: PropTypes.string,
    imagesWidth: PropTypes.number,
  }),

  similarPosts: PropTypes.arrayOf(PropTypes.object),

  error: PropTypes.shape({
    status: PropTypes.number,
  }),
};

PostPage.defaultProps = {
  language: 'uk',
  post: {},
  similarPosts: [],
  error: null,
};

export default withSession(PostPage);

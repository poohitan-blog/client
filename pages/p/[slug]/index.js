import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { parseCookies } from 'nookies';

import Error from '../../_error';
import { current } from '../../../config';
import API from '../../../services/api';
import { stripHTML, getImageLinksFromHTML, shorten } from '../../../services/text';

import withSession from '../../../hocs/withSession';
import Wrapper from '../../../components/Wrapper';
import Header from '../../../components/Header';
import Content from '../../../components/Content';
import Footer from '../../../components/Footer';
import Post from '../../../components/Post';
import CommentForm from '../../../components/post/CommentForm';
import BlogPosting from '../../../components/jsonld/BlogPosting';

const SimilarPostsGroup = dynamic(import('../../../components/SimilarPostsGroup'), {
  ssr: false,
  loading: () => null,
});

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
        return res.redirect(`/p/${post.slug}`);
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
      pathname,
      language,
      error,
    } = this.props;

    if (error) {
      return <Error statusCode={error.status} />;
    }

    const translation = (language && post.translations.find((item) => item.lang === language)) || {};
    const title = `${translation.title || post.title} - ${current.meta.title}`;
    const body = translation.body || post.body;
    const [image] = getImageLinksFromHTML(body);
    const description = translation.description
      || post.description
      || shorten(stripHTML(body), 20);
    const url = language
      ? `${current.clientURL}/p/${post.slug}/${language}`
      : `${current.clientURL}/p/${post.slug}`;

    return (
      <>
        <Head>
          <title>{title}</title>

          <link rel="canonical" href={url} />

          <meta name="description" content={description} key="description" />
          <meta name="keywords" content={post.tags.join(', ')} key="keywords" />

          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={description} />
          <meta name="twitter:site" content={current.meta.social.twitter.username} />
          <meta name="twitter:creator" content={current.meta.social.twitter.username} />
          <meta name="twitter:image:src" content={image} />

          <meta name="og:title" content={title} />
          <meta name="og:description" content={description} />
          <meta name="og:image" content={image} />
          <meta name="og:url" content={url} />
          <meta name="og:site_name" content={current.meta.title} />
          <meta name="og:locale" content={current.meta.language} />
          <meta name="og:type" content="website" />

          <BlogPosting
            title={post.title}
            slug={post.slug}
            body={post.body}
            tags={post.tags}
            publishedAt={new Date(post.publishedAt)}
          />
        </Head>
        <Wrapper pathname={pathname}>
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
              private={post.private}
              language={language}
              translations={post.translations}
              tags={post.tags}
              commentsCount={post.commentsCount}
              publishedAt={new Date(post.publishedAt)}
              imagesWidth={post.imagesWidth}
            />
            {
              similarPosts.length ? <SimilarPostsGroup posts={similarPosts} /> : null
            }
            <CommentForm title={post.title} slug={post.slug} />
          </Content>
          <Footer />
        </Wrapper>
      </>
    );
  }
}

PostPage.propTypes = {
  pathname: PropTypes.string.isRequired,
  language: PropTypes.string,

  post: PropTypes.shape({
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    description: PropTypes.string,
    slug: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string),
    publishedAt: PropTypes.instanceOf(Date),
    private: PropTypes.bool,
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

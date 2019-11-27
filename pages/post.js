import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import dynamic from 'next/dynamic';

import Error from './_error';
import { current } from '../config';
import API from '../services/api';
import { getAllCookies } from '../services/cookies';
import { getImageLinksFromHTML, shorten, stripHTML } from '../services/text';

import AuthenticatablePage from './_authenticatable';
import Wrapper from '../components/Wrapper';
import Header from '../components/Header';
import Content from '../components/Content';
import Footer from '../components/Footer';
import Post from '../components/Post';
import CommentForm from '../components/post/CommentForm';
import BlogPosting from '../components/jsonld/BlogPosting';

const SimilarPostsGroup = dynamic(import('../components/SimilarPostsGroup'), {
  ssr: false,
  loading: () => null,
});

class PostPage extends AuthenticatablePage {
  static async getInitialProps({
    query, req, res, pathname,
  }) {
    try {
      const parentProps = await super.getInitialProps({ req });
      const post = await API.posts.findOne(query.path, getAllCookies(req));
      const similarPosts = await API.posts.findSimilar(query.path);

      const availableLanguages = post.translations.map((item) => item.lang);
      const requestedLanguage = query.language;

      if (requestedLanguage && !availableLanguages.includes(requestedLanguage)) {
        return res.redirect(`/p/${post.path}`);
      }

      return {
        ...parentProps,
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
      || shorten(stripHTML(body, { decodeHTMLEntities: true }), 20);
    const url = language
      ? `${current.clientURL}/p/${post.path}/${language}`
      : `${current.clientURL}/p/${post.path}`;

    return (
      <Wrapper pathname={pathname}>
        <Head>
          <title>{title}</title>
          <meta name="description" content={description} key="description" />
          <meta name="keywords" content={post.tags.join(', ')} key="keywords" />

          <BlogPosting
            title={post.title}
            path={post.path}
            body={post.body}
            tags={post.tags}
            publishedAt={post.publishedAt}
          />

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
        </Head>
        <Header />
        { post.customStyles && <style dangerouslySetInnerHTML={{ __html: post.customStyles }} /> }
        <Content>
          <Post
            title={post.title}
            body={post.body}
            path={post.path}
            private={post.private}
            translations={post.translations}
            commentsCount={post.commentsCount}
            publishedAt={post.publishedAt}
            tags={post.tags}
            key={post.path}
            language={language}
          />
          {
            similarPosts.length ? <SimilarPostsGroup posts={similarPosts} /> : null
          }
          <CommentForm title={post.title} path={post.path} />
        </Content>
        <Footer />
      </Wrapper>
    );
  }
}

PostPage.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }),
  similarPosts: PropTypes.arrayOf(PropTypes.object),

  error: PropTypes.shape({
    status: PropTypes.number,
  }),
};

PostPage.defaultProps = {
  post: {},
  error: null,
};

export default PostPage;

import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Link from 'next/link';
import moment from 'moment';

import Error from './_error';
import { current } from '../config';

import API from '../services/api';
import { getAllCookies } from '../services/cookies';

import AuthenticatablePage from './_authenticatable';
import Wrapper from '../components/Wrapper';
import Header from '../components/Header';
import Content from '../components/Content';
import Footer from '../components/Footer';

class TopPage extends AuthenticatablePage {
  static async getInitialProps({ query, req }) {
    try {
      const parentProps = await super.getInitialProps({ query, req });
      const { docs } = await API.posts.find({}, getAllCookies(req));

      return Object.assign(parentProps, { posts: docs });
    } catch (error) {
      return { error };
    }
  }

  render() {
    if (this.props.error) {
      return <Error statusCode={this.props.error.status} />;
    }

    const { posts } = this.props;
    const {
      title,
      description,
      keywords,
      language,
      social,
    } = current.meta;

    return (
      <Wrapper>
        <Head>
          <title>{title}</title>
          <meta name="description" content={description} key="description" />
          <meta name="keywords" content={keywords.join(', ')} key="keywords" />

          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={description} />
          <meta name="twitter:site" content={social.twitter.username} />
          <meta name="twitter:creator" content={social.twitter.username} />

          <meta name="og:title" content={title} />
          <meta name="og:description" content={description} />
          <meta name="og:url" content={current.clientURL} />
          <meta name="og:site_name" content={title} />
          <meta name="og:locale" content={language} />
          <meta name="og:type" content="website" />
        </Head>
        <Header />
        <Content>
          <h1>Рейтинг записів за переглядами</h1>
          <ol>
            {
              posts
                .sort((left, right) => {
                  if (left.views < right.views) {
                    return 1;
                  }

                  if (left.views > right.views) {
                    return -1;
                  }

                  return 0;
                })
                .map(post => (
                  <li key={post.id}>
                    <Link href="/top"><a>{post.title}</a></Link> &mdash; <span className="">{post.views} переглядів</span> <span className="smaller">({moment(post.publishedAt).format('DD.MM.YYYY')})</span>
                  </li>
                ))
            }
          </ol>
        </Content>
        <Footer />
      </Wrapper>
    );
  }
}

TopPage.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,

  meta: PropTypes.shape({
    currentPage: PropTypes.number,
    totalPages: PropTypes.number,
  }).isRequired,

  error: PropTypes.shape({
    status: PropTypes.number,
  }),
};

TopPage.defaultProps = {
  error: null,
};

export default TopPage;

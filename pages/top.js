import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Link from 'next/link';
import moment from 'moment';

import Error from './_error';
import { current } from '../config';

import API from '../services/api';
import { describeWordCount } from '../services/grammar';
import { stripHTML } from '../services/text';
import { getAllCookies } from '../services/cookies';

import AuthenticatablePage from './_authenticatable';
import Wrapper from '../components/Wrapper';
import Header from '../components/Header';
import Content from '../components/Content';
import Footer from '../components/Footer';

const calculatePostInterestingness = (post) => {
  const ageInMilliseconds = moment().diff(post.publishedAt);
  const age = moment.duration(ageInMilliseconds).asDays();

  return Math.abs(post.views / age);
};

const sortByAbsoluteViewsNumber = ((left, right) => {
  if (left.views < right.views) {
    return 1;
  }

  if (left.views > right.views) {
    return -1;
  }

  return 0;
});

const sortByInterestingness = ((left, right) => {
  const leftInterestingness = calculatePostInterestingness(left);
  const rightInterestingness = calculatePostInterestingness(right);

  if (leftInterestingness < rightInterestingness) {
    return 1;
  }

  if (leftInterestingness > rightInterestingness) {
    return -1;
  }

  return 0;
});

const sortByCommentsCount = ((left, right) => {
  if (left.commentsCount < right.commentsCount) {
    return 1;
  }

  if (left.commentsCount > right.commentsCount) {
    return -1;
  }

  return 0;
});

const sortByLength = ((left, right) => {
  const leftLength = stripHTML(left.body).length;
  const rightLength = stripHTML(right.body).length;

  if (leftLength < rightLength) {
    return 1;
  }

  if (leftLength > rightLength) {
    return -1;
  }

  return 0;
});

const SORTING_PREDICATES = {
  views: sortByAbsoluteViewsNumber,
  interestingness: sortByInterestingness,
  commentness: sortByCommentsCount,
  length: sortByLength,
};

class TopPage extends AuthenticatablePage {
  static async getInitialProps({ query, req, pathname }) {
    try {
      const parentProps = await super.getInitialProps({ query, req });
      const { docs } = await API.posts.find({ private: false }, getAllCookies(req));

      return Object.assign(parentProps, { posts: docs, pathname });
    } catch (error) {
      return { error };
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      sortBy: 'views',
    };
  }

  render() {
    const {
      posts,
      pathname,
      error,
    } = this.props;

    if (error) {
      return <Error statusCode={error.status} />;
    }

    const { sortBy } = this.state;
    const sortButtons = [
      {
        title: 'За кількістю переглядів',
        param: 'views',
      },
      {
        title: 'За цікавістю',
        param: 'interestingness',
      },
      {
        title: 'За обговорюваністю',
        param: 'commentness',
      },
      {
        title: 'За довжиною',
        param: 'length',
      },
    ];
    const sortButtonsSeparator = <span>&nbsp;/&nbsp;</span>;

    return (
      <Wrapper pathname={pathname}>
        <Head>
          <title>Рейтинг записів - {current.meta.title}</title>
        </Head>
        <Header />
        <Content>
          <h1>Рейтинг записів</h1>
          <div className="smaller">
            {
              sortButtons
                .map(button => (
                  <a className={`pointer ${sortBy === button.param ? 'disabled' : ''}`} onClick={() => this.setState({ sortBy: button.param })} key={button.param}>{button.title}</a>
                ))
                .reduce((array, item) => [array, sortButtonsSeparator, item])
            }
          </div>
          <div className="smaller">(Цікавість — відношення кількості переглядів запису до його віку; обговорюваність — кількість коментарів під записом)</div>
          <ol>
            {
              posts
                .sort(SORTING_PREDICATES[sortBy])
                .map((post) => {
                  const diff = moment(post.publishedAt).diff(moment());
                  const age = moment.duration(diff);
                  const interestingness = calculatePostInterestingness(post).toFixed(2);

                  return (
                    <li key={post.id}>
                      <Link href={`/post?path=${post.path}`} as={`/p/${post.path}`}><a>{post.title}</a></Link>
                      <span className="smaller"><span className="nowrap">&nbsp;&mdash; переглядів: {post.views}</span>, <span className="nowrap">цікавість: {interestingness}</span>, <span className="nowrap">коментарів: {post.commentsCount}</span>, <span className="nowrap">вік: {age.locale('uk').humanize()}</span>, <span className="nowrap">довжина: {describeWordCount(stripHTML(post.body).length, ['символ', 'символи', 'символів'])}</span></span>
                    </li>
                  );
                })
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

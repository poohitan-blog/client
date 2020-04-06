import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Link from 'next/link';
import { differenceInCalendarDays, formatDistanceStrict } from 'date-fns';
import { uk } from 'date-fns/locale';
import { parseCookies } from 'nookies';

import { current } from 'Config';
import Error from 'Pages/_error';

import API from 'Services/api';
import { describeWordCount } from 'Services/grammar';
import { stripHTML } from 'Services/text';

import withSession from 'Hocs/withSession';
import Wrapper from 'Components/Wrapper';
import Header from 'Components/Header';
import Content from 'Components/Content';
import Footer from 'Components/Footer';

const calculatePostInterestingness = (post) => {
  const age = Math.max(differenceInCalendarDays(new Date(), new Date(post.publishedAt)), 1);

  return post.views / age;
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
  const leftLength = left.bodyLength;
  const rightLength = right.bodyLength;

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

class TopPage extends React.Component {
  static async getInitialProps({ req, pathname }) {
    try {
      const { docs } = await API.posts.find({ hidden: false }, parseCookies({ req }));

      return {
        posts: docs.map((post) => ({
          ...post,
          bodyLength: stripHTML(post.body).length,
        })),
        pathname,
      };
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
      <Wrapper>
        <Head>
          <title>{`Рейтинг записів - ${current.meta.title}`}</title>
        </Head>
        <Header />
        <Content>
          <h1>Рейтинг записів</h1>
          <div className="smaller">
            {
              sortButtons
                .map((button) => (
                  <a
                    className={`pointer ${sortBy === button.param ? 'disabled' : ''}`}
                    onClick={() => this.setState({ sortBy: button.param })}
                    key={button.param}
                  >
                    {button.title}
                  </a>
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
                  const interestingness = calculatePostInterestingness(post).toFixed(2);

                  return (
                    <li key={post.slug}>
                      <Link href="/p/[slug]" as={`/p/${post.slug}`}><a title={post.title}>{post.title}</a></Link>
                      <span className="smaller">
                        {' '}
                        <span className="nowrap">{`— переглядів: ${post.views || 0},`}</span>
                        {' '}
                        <span className="nowrap">{`цікавість: ${interestingness},`}</span>
                        {' '}
                        <span className="nowrap">{`коментарів: ${post.commentsCount || 0},`}</span>
                        {' '}
                        <span className="nowrap">{`вік: ${formatDistanceStrict(new Date(post.publishedAt), new Date(), { locale: uk })},`}</span>
                        {' '}
                        <span className="nowrap">
                          {`довжина: ${describeWordCount(post.bodyLength, ['символ', 'символи', 'символів'])}`}
                        </span>
                      </span>
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

  error: PropTypes.shape({
    status: PropTypes.number,
  }),
};

TopPage.defaultProps = {
  error: null,
};

export default withSession(TopPage);
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { NextSeo } from 'next-seo';
import { differenceInCalendarDays, formatDistanceStrict } from 'date-fns';
import { uk } from 'date-fns/locale';
import { parseCookies } from 'nookies';
import cc from 'classcat';

import API from 'services/api';
import { describeWordCount } from 'services/grammar';
import { stripHTML } from 'services/text';

import Wrapper from 'components/Wrapper';
import Header from 'components/Header';
import Content from 'components/Content';
import Footer from 'components/Footer';

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

function TopPage({ posts }) {
  const [sortBy, setSortBy] = useState('views');

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
      <NextSeo title="Рейтинг записів" />
      <Header />
      <Content>
        <h1>Рейтинг записів</h1>
        <div className="smaller">
          {
            sortButtons
              .map((button) => (
                <a
                  className={cc({ pointer: true, disabled: sortBy === button.param })}
                  onClick={() => setSortBy(button.param)}
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
                    <Link href={`/p/${post.slug}`}><a title={post.title}>{post.title}</a></Link>
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

export async function getServerSideProps({ req, res }) {
  try {
    const { docs } = await API.posts.find({ hidden: false }, parseCookies({ req }));

    return {
      props: {
        posts: docs.map((post) => ({
          ...post,
          bodyLength: stripHTML(post.body).length,
        })),
      },
    };
  } catch (error) {
    const { status } = error;

    res.statusCode = status;

    return {
      props: {
        error: {
          status,
        },
      },
    };
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

export default TopPage;

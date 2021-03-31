import React from 'react';
import PropTypes from 'prop-types';
import { NextSeo } from 'next-seo';
import { parseCookies } from 'nookies';

import API from 'services/api';

import Wrapper from 'components/Wrapper';
import Header from 'components/Header';
import Content from 'components/Content';
import Footer from 'components/Footer';
import SearchResult from 'components/SearchResult';
import SearchBox from 'components/SearchBox';
import TagCloud from 'components/TagCloud';

const POSTS_PER_PAGE = 10;

function SearchPage({
  searchQuery,
  searchResults,
  meta,
}) {
  const nothingFound = !searchResults.length;
  const content = nothingFound
    ? (
      <div className="text-center">
        <p className="fatty larger">Нічого не знайшлося.</p>
        <p>Хмаринка позначок:</p>
        <TagCloud shake minFontSize={1} maxFontSize={3} width="70%" />
      </div>
    )
    : searchResults
      .map((searchResult) => (
        <SearchResult
          id={searchResult.shortId || searchResult.id}
          key={searchResult.id}
          query={searchQuery}
          title={searchResult.title}
          body={searchResult.body}
          slug={searchResult.slug}
          searchResultType={searchResult.searchResultType}
          tags={searchResult.tags}
          publishedAt={new Date(searchResult.publishedAt)}
          createdAt={new Date(searchResult.createdAt)}
        />
      ));

  const paginationInfo = { ...meta, linkTexts: { next: 'Далі', previous: 'Назад' } };
  const title = searchQuery ? `Пошук за запитом «${searchQuery}»` : 'Пошук';

  return (
    <Wrapper>
      <NextSeo title={`Пошук за запитом «${searchQuery}»`} />
      <Header />
      <Content>
        <h1>{title}</h1>
        <>
          <SearchBox query={searchQuery} className="margin-bottom margin-top" />
          { content }
        </>
      </Content>
      {
        searchResults.length ? <Footer searchBox={false} pagination={paginationInfo} /> : null
      }
    </Wrapper>
  );
}

export async function getServerSideProps({ req, res, query }) {
  try {
    const { page = 1 } = query;
    const searchQuery = query.query;
    const { docs, meta } = await API.search({
      query: searchQuery,
      page,
      limit: POSTS_PER_PAGE,
    }, parseCookies({ req }));

    return {
      props: {
        searchResults: docs,
        searchQuery,
        meta,
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

SearchPage.propTypes = {
  searchResults: PropTypes.arrayOf(PropTypes.object).isRequired,
  searchQuery: PropTypes.string.isRequired,

  meta: PropTypes.shape({
    currentPage: PropTypes.number,
    totalPages: PropTypes.number,
  }).isRequired,

  error: PropTypes.shape({
    status: PropTypes.number,
  }),
};

SearchPage.defaultProps = {
  error: null,
};

export default SearchPage;

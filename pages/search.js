import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import API from '../services/api';
import Error from './_error';
import { current } from '../config';
import { getAllCookies } from '../services/cookies';

import AuthenticatablePage from './_authenticatable';
import Wrapper from '../components/Wrapper';
import Header from '../components/Header';
import Content from '../components/Content';
import Footer from '../components/Footer';
import SearchResult from '../components/SearchResult';
import TagCloud from '../components/TagCloud';

const POSTS_PER_PAGE = 10;

class SearchPage extends AuthenticatablePage {
  static async getInitialProps({ query, req, pathname }) {
    try {
      const parentProps = await super.getInitialProps({ req });
      const { page = 1 } = query;
      const searchQuery = query.query;
      const { docs, meta } = await API.search({
        query: searchQuery,
        page,
        limit: POSTS_PER_PAGE,
      }, getAllCookies(req));

      return {
        ...parentProps,
        searchResults: docs,
        pathname,
        meta,
        searchQuery,
      };
    } catch (error) {
      return { error };
    }
  }

  render() {
    const {
      searchQuery,
      searchResults,
      meta,
      pathname,
      error,
    } = this.props;

    if (error) {
      return <Error statusCode={error.status} />;
    }

    const nothingFound = !searchResults.length;
    let content;

    if (nothingFound) {
      content = (
        <div className="text-center">
          <p className="fatty larger">Нічого не знайшлося.</p>
          <p>Хмаринка позначок:</p>
          <TagCloud shake minFontSize={1} maxFontSize={3} width="70%" />
        </div>
      );
    } else {
      content = searchResults
        .map((searchResult) => (
          <SearchResult
            id={searchResult.id}
            key={searchResult.id}
            query={searchQuery}
            title={searchResult.title}
            body={searchResult.body}
            path={searchResult.path}
            searchResultType={searchResult.searchResultType}
            tags={searchResult.tags}
            publishedAt={searchResult.publishedAt}
            createdAt={searchResult.createdAt}
          />
        ));
    }

    const paginationInfo = { ...meta, linkTexts: { next: 'Далі', previous: 'Назад' } };

    return (
      <Wrapper pathname={pathname}>
        <Head>
          <title>{`Пошук за запитом «${searchQuery}» - ${current.meta.title}`}</title>
        </Head>
        <Header />
        <Content>
          <h1>{`Пошук за запитом «${searchQuery}»`}</h1>
          <>
            { content }
          </>
        </Content>
        <Footer pagination={paginationInfo} />
      </Wrapper>
    );
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

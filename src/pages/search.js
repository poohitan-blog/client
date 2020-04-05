import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { parseCookies } from 'nookies';

import { current } from 'Config';
import API from 'Services/api';
import Error from 'Pages/_error';

import withSession from 'Hocs/withSession';
import Wrapper from 'Components/Wrapper';
import Header from 'Components/Header';
import Content from 'Components/Content';
import Footer from 'Components/Footer';
import SearchResult from 'Components/SearchResult';
import SearchBox from 'Components/SearchBox';
import TagCloud from 'Components/TagCloud';

const POSTS_PER_PAGE = 10;

class SearchPage extends React.Component {
  static async getInitialProps({ query, req, pathname }) {
    try {
      const { page = 1 } = query;
      const searchQuery = query.query;
      const { docs, meta } = await API.search({
        query: searchQuery,
        page,
        limit: POSTS_PER_PAGE,
      }, parseCookies({ req }));

      return {
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
      error,
    } = this.props;

    if (error) {
      return <Error statusCode={error.status} />;
    }

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
            id={searchResult.id}
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
        <Head>
          <title>{`Пошук за запитом «${searchQuery}» - ${current.meta.title}`}</title>
        </Head>
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

export default withSession(SearchPage);

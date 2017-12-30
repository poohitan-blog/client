import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import API from '../services/api';
import Error from './_error';
import { getAllCookies } from '../services/cookies';

import Wrapper from '../components/Wrapper';
import Header from '../components/Header';
import Content from '../components/Content';
import Footer from '../components/Footer';
import SearchResult from '../components/SearchResult';

const POSTS_PER_PAGE = 10;

class SearchPage extends React.Component {
  static async getInitialProps({ query, req }) {
    try {
      const { page = 1 } = query;
      const searchQuery = query.query;
      const { docs, meta } = await API.search({
        query: searchQuery,
        page,
        limit: POSTS_PER_PAGE,
      }, getAllCookies(req));

      return {
        searchResults: docs,
        meta,
        searchQuery,
        query,
      };
    } catch (error) {
      return { error };
    }
  }

  render() {
    if (this.props.error) {
      return <Error statusCode={this.props.error.status} />;
    }

    const nothingFound = !this.props.searchResults.length;
    let content;

    if (nothingFound) {
      content = <p className="fatty text-center">Нічого не знайшлося.</p>;
    } else {
      content = this.props.searchResults
        .map(searchResult => <SearchResult {...searchResult} key={searchResult.id} query={this.props.searchQuery} />);
    }

    const paginationInfo = { ...this.props.meta, linkTexts: { next: 'Далі', previous: 'Назад' } };

    return (
      <Wrapper>
        <Head>
          <title>Пошук за запитом «{this.props.searchQuery}» - poohitan</title>
        </Head>
        <Header />
        <Content>
          <h1>Пошук за запитом «{this.props.searchQuery}»</h1>
          <div>
            { content }
          </div>
        </Content>
        <Footer pagination={paginationInfo} query={this.props.query} />
      </Wrapper>
    );
  }
}

SearchPage.propTypes = {
  searchResults: PropTypes.arrayOf(PropTypes.object).isRequired,
  searchQuery: PropTypes.string.isRequired,
  query: PropTypes.shape({}),

  meta: PropTypes.shape({
    currentPage: PropTypes.number,
    totalPages: PropTypes.number,
  }).isRequired,

  error: PropTypes.shape({
    status: PropTypes.number,
  }),
};

SearchPage.defaultProps = {
  query: {},
  error: null,
};

export default SearchPage;

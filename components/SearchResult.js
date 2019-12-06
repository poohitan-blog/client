import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import HTMLReactParser from 'html-react-parser';
import { isValid } from 'date-fns';

import { stripHTML, getHighlightsOfKeywords, shorten } from '../services/text';
import { formatPostDate } from '../services/grammar';

const searchResultTypes = {
  post: 'Запис',
  page: 'Сторінка',
  trashPost: 'Запис у смітнику',
};

const BODY_MAX_LENGTH_WORDS = 70;

function highlightQueryInText(text, query) {
  const regexes = query.split(' ').map((queryWord) => new RegExp(`(?:[\\s.,?!@#$%^&*()_+{}|\\[\\]]+?|^)${queryWord}(?:[\\s.,?!@#$%^&*()_+{}|\\[\\]]+?|$)`, 'i'));

  return text.split(' ')
    .map((word) => (regexes.some((regex) => regex.test(word)) ? ({ text: word, highlighted: true }) : ({ text: word })))
    .reduce((previousWords, word) => {
      if (!previousWords.length) {
        return [word];
      }

      const lastWord = previousWords[previousWords.length - 1];

      if (!(word.highlighted && lastWord.highlighted)) {
        return [...previousWords, word];
      }

      const wordsBeforeLastWord = previousWords.slice(0, previousWords.length - 1);

      return [...wordsBeforeLastWord, { text: [lastWord.text, word.text].join(' '), highlighted: true }];
    }, [])
    .map((word) => (word.highlighted
      ? `<span class="search-result-highlight">${word.text}</span>`
      : word.text))
    .join(' ');
}

function generateLinkParams({ id, path, searchResultType }) {
  if (searchResultType === 'post') {
    return {
      href: `/post?path=${path}`,
      as: `/p/${path}`,
    };
  }

  if (searchResultType === 'trashPost') {
    return {
      href: `/trash?id=${id}`,
      as: `/trash/${id}`,
    };
  }

  return {
    href: `/page?path=${path}`,
    as: `/${path}`,
  };
}

function generateDescription(params) {
  const {
    tags,
    createdAt,
    publishedAt,
    searchResultType,
    query,
  } = params;
  const type = searchResultTypes[searchResultType];
  const date = isValid(publishedAt) ? publishedAt : createdAt;

  const dateMarkup = (
    <div className="search-result-description-date smaller">{formatPostDate(date)}</div>
  );
  let tagsMarkup;

  if (searchResultType === 'post') {
    const highlightedTags = tags.map((tag) => highlightQueryInText(tag, query)).join(', ');

    tagsMarkup = `<span>Позначки: ${highlightedTags}</span>`;
  }

  return (
    <>
      <div className="layout-row layout-align-space-between-center">
        <b>{type}</b>
        {dateMarkup}
      </div>
      { tagsMarkup ? <div className="smaller nowrap">{HTMLReactParser(tagsMarkup)}</div> : null }
    </>
  );
}

const SearchResult = (props) => {
  const {
    id,
    title,
    path,
    body,
    tags,
    createdAt,
    publishedAt,
    query,
    searchResultType,
  } = props;

  const resultTitle = title ? highlightQueryInText(title, query) : '';
  const bodyText = stripHTML(body);
  const queryWords = query.split(' ');
  const regexes = queryWords.map((queryWord) => new RegExp(`(?:[\\s.,?!@#$%^&*()_+{}|\\[\\]]+?|^)${queryWord}(?:[\\s.,?!@#$%^&*()_+{}|\\[\\]]+?|$)`, 'i'));

  let resultBody;

  if (regexes.some((regex) => regex.test(bodyText))) {
    const highlights = getHighlightsOfKeywords({ text: bodyText, keywords: queryWords })
      .map((highlight) => highlightQueryInText(highlight, query))
      .join('<span class="search-result-highlight-separator"></span>');

    resultBody = shorten(highlights, BODY_MAX_LENGTH_WORDS);
  } else {
    resultBody = shorten(bodyText, BODY_MAX_LENGTH_WORDS);
  }

  const { href, as } = generateLinkParams({ id, path, searchResultType });
  const description = generateDescription({
    tags,
    createdAt,
    publishedAt,
    searchResultType,
    query,
  });

  return (
    <div className="search-result">
      <Link href={href} as={as}>
        <a title={resultTitle}>
          <div className="search-result-inner">
            <h3>{resultTitle}</h3>
            <p>{HTMLReactParser(resultBody)}</p>
          </div>
          <div className="search-result-description">
            {description}
          </div>
        </a>
      </Link>
    </div>
  );
};

SearchResult.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
  body: PropTypes.string.isRequired,
  path: PropTypes.string,
  query: PropTypes.string.isRequired,
  searchResultType: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string),
  publishedAt: PropTypes.instanceOf(Date),
  createdAt: PropTypes.instanceOf(Date),
};

SearchResult.defaultProps = {
  title: '',
  path: '',
  tags: null,
  createdAt: null,
  publishedAt: null,
};

export default SearchResult;

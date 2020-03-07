import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import HTMLReactParser from 'html-react-parser';
import { isValid } from 'date-fns';

import { stripHTML, getHighlightsOfKeywords, shorten } from '../services/text';
import { formatPostDate } from '../services/grammar';

import styles from '../styles/components/search-result.scss';

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
      ? `<span class=${styles.highlight}>${word.text}</span>`
      : word.text))
    .join(' ');
}

function generateLinkParams({ id, path, searchResultType }) {
  if (searchResultType === 'post') {
    return {
      href: '/p/[slug]',
      as: `/p/${path}`,
    };
  }

  if (searchResultType === 'trashPost') {
    return {
      href: '/trash/[id]',
      as: `/trash/${id}`,
    };
  }

  return {
    href: '/[slug]',
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

  const highlightedTags = tags
    ? tags.map((tag) => highlightQueryInText(tag, query)).join(', ')
    : null;

  return (
    <>
      <div className={styles.descriptionWrapper}>
        <b>{type}</b>
        <div className={styles.date}>{formatPostDate(date)}</div>
      </div>
      {
        highlightedTags
          ? (
            <div className={styles.tags}>
              <span>Позначки:&nbsp;</span>
              {HTMLReactParser(highlightedTags)}
            </div>
          )
          : null
      }
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
      .join(`<span class="${styles.highlightSeparator}"></span>`);

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
    <div className={styles.wrapper}>
      <Link href={href} as={as}>
        <a title={resultTitle}>
          <div className={styles.inner}>
            <h3>{HTMLReactParser(resultTitle)}</h3>
            <p>{HTMLReactParser(resultBody)}</p>
          </div>
          <div className={styles.description}>
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

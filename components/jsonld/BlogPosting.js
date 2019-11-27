import React from 'react';
import PropTypes from 'prop-types';
import { current } from '../../config';
import { stripHTML, getImageLinksFromHTML } from '../../services/text';

const BlogPosting = ({
  title,
  path,
  body,
  tags,
  publishedAt,
}) => {
  const postURL = `${current.clientURL}/p/${path}`;
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    image: getImageLinksFromHTML(body)[0],
    keywords: tags.join(' '),
    articleBody: stripHTML(body, { decodeHTMLEntities: true }),
    url: postURL,
    mainEntityOfPage: postURL,
    datePublished: publishedAt.toISOString(),
    dateCreated: publishedAt.toISOString(),
    dateModified: publishedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: 'Bohdan Prokopovych',
    },
    publisher: {
      '@type': 'Organization',
      name: 'poohitan',
      logo: {
        '@type': 'ImageObject',
        url: 'https://api.poohitan.com/images/jack_100.jpg',
        width: '100',
        height: '98',
      },
    },
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
};

BlogPosting.propTypes = {
  title: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string),
  publishedAt: PropTypes.instanceOf(Date).isRequired,
};

BlogPosting.defaultProps = {
  tags: [],
};

export default BlogPosting;

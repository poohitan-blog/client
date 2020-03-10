import React from 'react';
import { current } from '../../config';

const Blog = () => {
  const data = {
    '@context': 'http://schema.org',
    '@type': 'Blog',
    name: current.meta.title,
    url: current.clientURL,
    description: current.meta.description,
    sameAs: Object.keys(current.meta.social).map((socialName) => current.meta.social[socialName].link),
    publisher: {
      '@type': 'Organization',
      name: current.meta.title,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${current.clientURL}/search?query={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
};

export default React.memo(Blog);

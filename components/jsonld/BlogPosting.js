import React from 'react';
import PropTypes from 'prop-types';
import { current } from '../../config';
import { stripHTML } from '../../services/text';

function getURLOfMainPostImage(body) {
  const regex = /<img(?:\s*|\w*)src="(\S+)"(?:\s*|\w*)\/?>/;
  const matches = body.match(regex);

  return matches ? matches[1] : '';
}

const BlogPosting = (props) => {
  const postURL = `${current.clientURL}/p/${props.path}`;
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: props.title,
    image: getURLOfMainPostImage(props.body),
    keywords: props.tags.join(' '),
    articleBody: stripHTML(props.body),
    url: postURL,
    mainEntityOfPage: postURL,
    datePublished: props.publishedAt.toISOString(),
    dateCreated: props.publishedAt.toISOString(),
    dateModified: props.publishedAt.toISOString(),
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

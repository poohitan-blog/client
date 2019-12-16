import React from 'react';
import PropTypes from 'prop-types';
import HTMLReactParser from 'html-react-parser';
import { trackWindowScroll } from 'react-lazy-load-image-component';

import { generateLazyPreview } from '../../services/image-previews';

const FullBody = ({
  language, body, scrollPosition, imagesWidth,
}) => HTMLReactParser(body, {
  replace(node) {
    if (node.type === 'tag' && node.name === 'img') {
      return generateLazyPreview(node, {
        altLanguage: language,
        thumbnailWidth: imagesWidth,
        scrollPosition,
      });
    }

    if (node.type === 'tag' && node.name === 'cut') {
      return <span id="cut" />;
    }

    return null;
  },
});

FullBody.propTypes = {
  language: PropTypes.string.isRequired,
  body: PropTypes.node.isRequired,
  scrollPosition: PropTypes.shape({}),
  imagesWidth: PropTypes.number.isRequired,
};

FullBody.defaultProps = {
  scrollPosition: null,
};

export default trackWindowScroll(FullBody);

import React from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';
import { trackWindowScroll } from 'react-lazy-load-image-component';

import { generateLazyPreview } from '../../services/image-previews';

const FullBody = ({ body, scrollPosition, imagesWidth }) => (
  <>
    {
      ReactHtmlParser(body, {
        transform(node) { // eslint-disable-line
          if (node.type === 'tag' && node.name === 'img') {
            return generateLazyPreview(node, { scrollPosition, thumbnailWidth: imagesWidth });
          }

          if (node.type === 'tag' && node.name === 'cut') {
            return null;
          }
        },
      })
    }
  </>
);

FullBody.propTypes = {
  body: PropTypes.node.isRequired,
  scrollPosition: PropTypes.shape({}),
  imagesWidth: PropTypes.number.isRequired,
};

FullBody.defaultProps = {
  scrollPosition: null,
};

export default trackWindowScroll(FullBody);

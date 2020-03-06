import PropTypes from 'prop-types';
import HTMLReactParser from 'html-react-parser';
import { trackWindowScroll } from 'react-lazy-load-image-component';

import HTMLProcessor from '../../utils/html-processor';

const FullBody = ({
  language, body, scrollPosition, imagesWidth,
}) => HTMLReactParser(body, {
  replace(node) {
    return new HTMLProcessor(node)
      .asImage({ language, imagesWidth, scrollPosition })
      .asCut()
      .getNode();
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

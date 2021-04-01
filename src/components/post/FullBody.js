import PropTypes from 'prop-types';
import parse from 'html-react-parser';

import HTMLProcessor from 'utils/html-processor';

const FullBody = ({
  language, body, imagesWidth,
}) => parse(body, {
  replace(node) {
    return new HTMLProcessor(node)
      .asImage({ language, imagesWidth })
      .asCut()
      .asLink()
      .asCode()
      .asIframe()
      .asMath()
      .getNode();
  },
});

FullBody.propTypes = {
  language: PropTypes.string.isRequired,
  body: PropTypes.node.isRequired,
  imagesWidth: PropTypes.number.isRequired,
};

export default FullBody;

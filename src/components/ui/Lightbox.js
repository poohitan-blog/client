// Warning: this component can be used client-side only
// Import it using dynamic import with "ssr: false"

import React from 'react';
import PropTypes from 'prop-types';
import 'lightgallery.js/dist/js/lightgallery';
import 'lightgallery.js/dist/css/lightgallery.min.css';

import { LIGHTBOX_CLASS } from 'utils/html-processor/image';

const CONTAINER_SELECTOR = 'body';

class Lightbox extends React.Component {
  static reload(container) {
    Lightbox.destroy(container);

    global.lightGallery(container, {
      mode: 'lg-fade',
      startClass: 'lg-fade',
      download: false,
      enableDrag: false,
      hideBarsDelay: 3000,
      getCaptionFromTitleOrAlt: false,
      selector: `.${LIGHTBOX_CLASS}`,
      addClass: 'lightbox',
    });
  }

  static destroy(container) {
    const lightboxId = container && container.getAttribute('lg-uid');
    const lightboxInstance = global.lgData && global.lgData[lightboxId];

    if (lightboxInstance) {
      lightboxInstance.destroy(true);
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      container: null,
    };
  }

  componentDidMount() {
    const container = document.querySelector(CONTAINER_SELECTOR);

    Lightbox.reload(container);
    this.setState({ container });
  }

  componentDidUpdate(prevProps) {
    const { id: currentId } = this.props;
    const { id: previousId } = prevProps;
    const { container } = this.state;

    if (currentId !== previousId) {
      Lightbox.reload(container);
    }
  }

  componentWillUnmount() {
    const { container } = this.state;

    Lightbox.destroy(container);
  }

  render() {
    return null;
  }
}

Lightbox.propTypes = {
  id: PropTypes.string.isRequired,
};

export default Lightbox;

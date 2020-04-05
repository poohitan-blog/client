// Warning: this component can be used client-side only
// Import it using dynamic import with "ssr: false"

import React from 'react';
import PropTypes from 'prop-types';
import 'lightgallery.js';

import { LIGHTBOX_CLASS } from 'Utils/html-processor/image';

const CONTAINER_SELECTOR = 'body';

class Lightbox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      container: null,
    };

    this.reload = this.reload.bind(this);
    this.destroy = this.destroy.bind(this);
  }

  componentDidMount() {
    this.reload();
  }

  componentDidUpdate(prevProps) {
    const { id: currentId } = this.props;
    const { id: previousId } = prevProps;

    if (currentId !== previousId) {
      this.reload();
    }
  }

  componentWillUnmount() {
    this.destroy();
  }

  reload() {
    this.destroy();

    const container = document.querySelector(CONTAINER_SELECTOR);

    this.setState({ container });

    global.lightGallery(container, {
      mode: 'lg-fade',
      startClass: 'lg-fade',
      download: false,
      hideBarsDelay: 3000,
      getCaptionFromTitleOrAlt: false,
      selector: `.${LIGHTBOX_CLASS}`,
    });
  }

  destroy() {
    const { container } = this.state;

    const lightboxId = container && container.getAttribute('lg-uid');
    const lightboxInstance = global.lgData && global.lgData[lightboxId];

    if (lightboxInstance) {
      lightboxInstance.destroy(true);
    }
  }

  render() {
    return null;
  }
}

Lightbox.propTypes = {
  id: PropTypes.string.isRequired,
};

export default Lightbox;

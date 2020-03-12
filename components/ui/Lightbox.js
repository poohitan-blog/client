// Warning: this component can be used client-side only
// Import it using dynamic import with "ssr: false"

import React from 'react';
import PropTypes from 'prop-types';
import '../../public/static/libs/lightbox/featherlight.min';
import '../../public/static/libs/lightbox/featherlight.gallery.uk.min';

class Lightbox extends React.Component {
  componentDidMount() {
    const { selector } = this.props;

    $(selector).featherlightGallery({
      galleryFadeIn: 100,
      galleryFadeOut: 200,
      type: 'image',
    });
  }

  render() {
    return null;
  }
}

Lightbox.propTypes = {
  selector: PropTypes.string.isRequired,
};

export default Lightbox;

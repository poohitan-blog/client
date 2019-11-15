// Warning: this component can be used client-side only
// Import it using dynamic import with "ssr: false"

import React from 'react';
import PropTypes from 'prop-types';
import '../../public/libs/lightbox/featherlight.min';
import '../../public/libs/lightbox/featherlight.gallery.uk.min';
import styles from '../../public/libs/lightbox/featherlight.min.css';
import galleryStyles from '../../public/libs/lightbox/featherlight.gallery.min.css';

class Lightbox extends React.Component {
  componentDidMount() {
    $(this.props.selector).featherlightGallery({
      galleryFadeIn: 100,
      galleryFadeOut: 200,
      type: 'image',
    });
  }

  render() {
    return <style>{styles + galleryStyles}</style>;
  }
}

Lightbox.propTypes = {
  selector: PropTypes.string.isRequired,
};

export default Lightbox;

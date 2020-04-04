// Warning: this component can be used client-side only
// Import it using dynamic import with "ssr: false"

import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import '../../public/static/libs/lightbox/featherlight.min';
import '../../public/static/libs/lightbox/featherlight.gallery.uk.min';

class Lightbox extends React.Component {
  constructor(props) {
    super(props);

    this.initialize = this.initialize.bind(this);
  }

  componentDidMount() {
    console.log('componentDidMount', $);
    this.initialize();
  }

  componentDidUpdate() {
    this.initialize();
  }

  initialize() {
    const { selector } = this.props;

    console.log('!', $);

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

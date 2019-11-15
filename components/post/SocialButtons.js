// Warning: this component can be used client-side only
// Import it using dynamic import with "ssr: false"

import React from 'react';
import PropTypes from 'prop-types';
import { current } from '../../config';
import styles from '../../public/libs/social/jssocials.css';
import themeStyles from '../../public/libs/social/jssocials-theme-minima.css';
import '../../public/libs/social/jssocials.min';

class SocialButtons extends React.Component {
  componentDidMount() {
    $(`.post-footer-social[data-path="${this.props.path}"]`).jsSocials({
      shares: ['twitter', 'facebook'],
      showLabel: false,
      showCount: false,
      url: `${current.clientURL}/p/${this.props.path}`,
      text: `${this.props.title} - ${current.meta.title}`,
      shareIn: 'popup',
    });
  }

  render() {
    return (
      <div className="post-footer-social-wrapper nowrap">
        <style>{styles + themeStyles}</style>
        <div className="post-footer-item post-footer-social" data-path={this.props.path} />
      </div>
    );
  }
}

SocialButtons.propTypes = {
  title: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
};

export default SocialButtons;

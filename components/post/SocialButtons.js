// Warning: this component can be used client-side only
// Import it using dynamic import with "ssr: false"

import React from 'react';
import PropTypes from 'prop-types';
import { current } from '../../config';
import styles from '../../static/libs/social/jssocials.css';
import themeStyles from '../../static/libs/social/jssocials-theme-minima.css';
import '../../static/libs/social/jssocials.min';

class SocialButtons extends React.Component {
  componentDidMount() {
    $(`.post-footer-social[data-path="${this.props.path}"]`).jsSocials({
      shares: ['twitter', 'facebook', 'googleplus', 'vkontakte'],
      showLabel: false,
      showCount: false,
      url: `${current.clientURL}/p/${this.props.path}`,
      text: this.props.title,
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

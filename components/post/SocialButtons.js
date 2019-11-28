// Warning: this component can be used client-side only
// Import it using dynamic import with "ssr: false"

import React from 'react';
import PropTypes from 'prop-types';
import { current } from '../../config';
import styles from '../../public/static/libs/social/jssocials.css';
import themeStyles from '../../public/static/libs/social/jssocials-theme-minima.css';
import '../../public/static/libs/social/jssocials.min';

class SocialButtons extends React.Component {
  componentDidMount() {
    const { title, path } = this.props;

    $(`.post-footer-social[data-path="${path}"]`).jsSocials({
      shares: ['twitter', 'facebook'],
      showLabel: false,
      showCount: false,
      url: `${current.clientURL}/p/${path}`,
      text: `${title} - ${current.meta.title}`,
      shareIn: 'popup',
    });
  }

  render() {
    const { path } = this.props;

    return (
      <div className="post-footer-social-wrapper nowrap">
        <style>{styles + themeStyles}</style>
        <div className="post-footer-item post-footer-social" data-path={path} />
      </div>
    );
  }
}

SocialButtons.propTypes = {
  title: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
};

export default SocialButtons;

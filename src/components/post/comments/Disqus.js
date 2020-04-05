import React from 'react';
import PropTypes from 'prop-types';
import { DiscussionEmbed } from 'disqus-react';

import { current } from 'Config';

class Disqus extends React.Component {
  shouldComponentUpdate(nextProps) {
    const { title, identifier } = this.props;
    const { title: nextTitle, identifier: nextIdentifier } = nextProps;

    if (nextTitle !== title || nextIdentifier !== identifier) {
      return true;
    }

    return false;
  }

  render() {
    const { title, identifier, onReady } = this.props;

    return (
      <DiscussionEmbed
        shortname={current.disqus.shortname}
        config={{
          title,
          identifier,
          onReady,
          url: `${current.clientURL}/p/${identifier}`,
        }}
      />
    );
  }
}

Disqus.propTypes = {
  title: PropTypes.string.isRequired,
  identifier: PropTypes.string.isRequired,
  onReady: PropTypes.func,
};

Disqus.defaultProps = {
  onReady: () => {},
};

export default Disqus;

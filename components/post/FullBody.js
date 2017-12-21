import React from 'react';
import PropTypes from 'prop-types';

const FullBody = (props) => {
  const markup = { __html: props.body };

  return (
    <div>
      <div dangerouslySetInnerHTML={markup} />
    </div>
  );
};

FullBody.propTypes = {
  body: PropTypes.string.isRequired,
};

export default FullBody;

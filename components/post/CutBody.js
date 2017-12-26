import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

const CUT_TAG = '<cut>';
const READ_MORE = 'Читати повністю';

function cut(body) {
  const cutPosition = body.indexOf(CUT_TAG);

  return cutPosition > 0 ? body.slice(0, cutPosition) : body;
}

const CutBody = (props) => {
  const markup = { __html: cut(props.body) };

  return (
    <div>
      <div dangerouslySetInnerHTML={markup} />
      <Link as={`/p/${props.path}`} href={`/post?path=${props.path}`} prefetch><a>{READ_MORE}</a></Link>
    </div>
  );
};

CutBody.propTypes = {
  body: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
};

export default CutBody;

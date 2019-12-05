import React from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';
import Link from 'next/link';

import { generateLazyPreview } from '../../services/image-previews';

const CUT_TAG = '<cut>';
const READ_MORE = 'Читати повністю';

function cut(body) {
  const cutPosition = body.indexOf(CUT_TAG);

  return cutPosition > 0 ? body.slice(0, cutPosition) : body;
}

const CutBody = ({ title, path, body }) => {
  const cutHtml = cut(body);
  const transformedBody = ReactHtmlParser(cutHtml, {
    transform(node) { // eslint-disable-line
      if (node.type === 'tag' && node.name === 'img') {
        return generateLazyPreview(node);
      }
    },
  });

  return (
    <>
      { transformedBody }
      <Link as={`/p/${path}`} href={`/post?path=${path}#cut`}>
        <a title={`${READ_MORE} «${title}»`}>{READ_MORE}</a>
      </Link>
    </>
  );
};

CutBody.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.node.isRequired,
  path: PropTypes.string.isRequired,
};

export default CutBody;

import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import HTMLReactParser from 'html-react-parser';

import HTMLProcessor from '../../utils/html-processor';

const CUT_TAG = '<cut>';
const READ_MORE = 'Читати повністю';

function cut(body) {
  const cutPosition = body.indexOf(CUT_TAG);

  return cutPosition > 0 ? body.slice(0, cutPosition) : body;
}

const CutBody = ({ title, slug, body }) => {
  const cutHtml = cut(body);

  return (
    <>
      {
        HTMLReactParser(cutHtml, {
          replace(node) {
            return new HTMLProcessor(node)
              .asImage()
              .asLink()
              .getNode();
          },
        })
      }
      <Link as={`/p/${slug}`} href="/p/[slug]">
        <a title={`${READ_MORE} «${title}»`}>{READ_MORE}</a>
      </Link>
    </>
  );
};

CutBody.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.node.isRequired,
  slug: PropTypes.string.isRequired,
};

export default CutBody;

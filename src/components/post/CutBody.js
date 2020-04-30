import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import parse from 'html-react-parser';

import { withTranslation } from 'Utils/i18n';
import HTMLProcessor from 'Utils/html-processor';

const CUT_TAG = '<cut>';

function cut(body) {
  const cutPosition = body.indexOf(CUT_TAG);

  return cutPosition > 0 ? body.slice(0, cutPosition) : body;
}

const CutBody = ({ title, slug, body, t }) => {
  const cutHtml = cut(body);

  return (
    <>
      {
        parse(cutHtml, {
          replace(node) {
            return new HTMLProcessor(node)
              .asImage()
              .asLink()
              .asMath()
              .asIframe()
              .getNode();
          },
        })
      }
      <Link as={`/p/${slug}`} href="/p/[slug]">
        <a title={`${t('readFullText')} «${title}»`}>{t('readFullText')}</a>
      </Link>
    </>
  );
};

CutBody.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.node.isRequired,
  slug: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation('post')(CutBody);

import React from 'react';
import Link from 'next/link';
import { domToReact } from 'html-react-parser';

import { current } from 'config';

export default function processLink() {
  const { node } = this;
  const {
    name,
    type,
    attribs = {},
    children,
  } = node;
  const { href: url } = attribs;
  const isLink = type === 'tag' && name === 'a' && url;

  if (isLink) {
    const isRelativeLink = url[0] === '/';
    const isSelfLink = url.indexOf(current.clientURL) === 0;

    const relativeURL = isSelfLink ? url.replace(current.clientURL, '') : url;

    const isStaticLink = current.staticRoutes.some((item) => item.test(relativeURL));

    if (isStaticLink) {
      return this;
    }

    if (isRelativeLink || isSelfLink) {
      this.processedNode = (
        <Link href={relativeURL}>
          <a>{domToReact(children)}</a>
        </Link>
      );
    }
  }

  return this;
}

import React from 'react';
import Link from 'next/link';
import { domToReact } from 'html-react-parser';

import { current } from 'Config';
import getRouteByURL from 'Helpers/get-route-by-url';

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

    if (isRelativeLink || isSelfLink) {
      const relativeURL = isSelfLink ? url.replace(current.clientURL, '') : url;
      const route = getRouteByURL(relativeURL);

      this.processedNode = (
        <Link as={relativeURL} href={route}>
          <a>{domToReact(children)}</a>
        </Link>
      );
    }
  }

  return this;
}

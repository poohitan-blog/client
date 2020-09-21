// TODO: switch to built-in Next.js logic as soon as this issue is closed and shipped https://github.com/zeit/next.js/issues/8207

const STATIC_ROUTES = [
  /^\/rss\/?/,
  /^\/stuff\/[\S]+/,
  /^\/rainbow-sheep/,
  /^\/google/,
  /^\/comic-saaaaaaanns!!/,
  /^\/webcolors/,
  /^\/thats-a-paddlin/,
  /^\/tortynka/,
  /^\/uah/,
  /^\/shutup/,
];

const DYNAMIC_ROUTES = [
  {
    href: '/tag/[name]',
    regex: /^\/tag\/\S+/,
  },
  {
    href: '/p/[slug]/[language]',
    regex: /^\/p\/[\w-_]+\/\w{2,3}/,
  },
  {
    href: '/p/[slug]',
    regex: /^\/p\/[\w-_]+/,
  },
  {
    href: '/trash/[id]',
    regex: /^\/trash\/[\w-]+/,
  },
  {
    href: (href) => {
      const matches = href.match(/^\/trash\/?\?permalink=(\d{8}_\d{6})/) || [];

      return `/trash?permalink=${matches[1]}`;
    },
    regex: /^\/trash\/?\?permalink=\d{8}_\d{6}/,
  },
  {
    href: '/trash',
    regex: /^\/trash/,
  },
  {
    href: '/top',
    regex: /^\/top/,
  },
  {
    href: '/search',
    regex: /^\/search/,
  },
  {
    href: '/[slug]',
    regex: /^\/[\w-_]+/,
  },
];

export default function getRouteByRelativeURL(url) {
  if (STATIC_ROUTES.some((item) => item.test(url))) {
    return url;
  }

  const route = DYNAMIC_ROUTES.find((item) => item.regex.test(url));

  if (!route) {
    return url;
  }

  if (typeof route.href === 'function') {
    return route.href(url);
  }

  return typeof route.href === 'function' ? route.href(url) : route.href;
}

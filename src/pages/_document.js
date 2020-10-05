import React from 'react';
import Document, {
  Html, Head, Main, NextScript,
} from 'next/document';
import Raspberries from 'services/raspberries';
import { current } from 'config';

class MyDocument extends Document {
  static async getInitialProps({ renderPage, req, res }) {
    const raspberriesDay = Raspberries.runLottery(req, res);

    const {
      html,
      head,
      errorHtml,
      chunks,
    } = renderPage();

    return {
      html,
      head,
      errorHtml,
      chunks,
      raspberriesDay,
    };
  }

  render() {
    return (
      <Html lang={current.meta.language}>
        <Head>
          <meta name="google-site-verification" content={current.google.siteVerificationCode} key="google-site-verification" />
          <meta httpEquiv="content-type" content="text/html; charset=utf-8" key="content-type" />

          <link rel="icon" href="/static/icons/favicon_96x96.png" type="image/png" sizes="96x96" />
          <link rel="icon" href="/static/icons/favicon_256x256.png" type="image/png" sizes="256x256" />

          <link rel="alternate" type="application/rss+xml" title="poohitan.com" href={`${current.clientURL}/rss`} />
          <link rel="author" href="humans.txt" />

          <link rel="preconnect" href="https://www.google-analytics.com" />
          <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        </Head>
        <body className={this.props.raspberriesDay ? 'raspberries' : null}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

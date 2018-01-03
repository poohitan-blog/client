import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import Raspberries from '../services/raspberries';
import config from '../config';
import styles from '../styles/main.scss';

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
      <html lang="uk-UA">
        <Head>
          <title>poohitan</title>

          <meta name="viewport" content="initial-scale=1.0, width=device-width" key="viewport" />
          <meta httpEquiv="content-type" content="text/html; charset=utf-8" />
          <link rel="icon" href="/static/icons/favicon.ico" type="image/x-icon" />
          <link rel="alternate" type="application/rss+xml" title="RSS блоґу" href={`${config.current.clientURL}/rss`} />

          <script src="https://code.jquery.com/jquery-3.2.1.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossOrigin="anonymous" />

          <script src="/static/libs/lightbox/featherlight.min.js" type="text/javascript" charSet="utf-8" />
          <script src="/static/libs/lightbox/featherlight.gallery.uk.min.js" type="text/javascript" charSet="utf-8" />
          <link href="/static/libs/lightbox/featherlight.min.css" type="text/css" rel="stylesheet" />
          <link href="/static/libs/lightbox/featherlight.gallery.min.css" type="text/css" rel="stylesheet" />

          <script src="/static/libs/social/jssocials.min.js" type="text/javascript" charSet="utf-8" />
          <link href="/static/libs/social/jssocials.css" type="text/css" rel="stylesheet" />
          <link href="/static/libs/social/jssocials-theme-minima.css" type="text/css" rel="stylesheet" />
          <link type="text/css" rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />

          <style dangerouslySetInnerHTML={{ __html: styles }} />
        </Head>
        <body className={this.props.raspberriesDay ? 'raspberries' : ''}>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

export default MyDocument;

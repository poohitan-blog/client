import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import Raspberries from '../services/raspberries';
import { current } from '../config';
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
      <Html lang={current.meta.language}>
        <Head>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" key="viewport" />
          <meta name="google-site-verification" content={current.google.siteVerificationCode} key="google-site-verification" />
          <meta httpEquiv="content-type" content="text/html; charset=utf-8" key="content-type" />

          <link rel="icon" href="/static/icons/favicon.ico" type="image/x-icon" />
          <link rel="alternate" type="application/rss+xml" title="poohitan.com" href={`${current.clientURL}/rss`} />
          <link rel="author" href="humans.txt" />

          <link rel="preconnect" href="https://www.google-analytics.com" />
          <link rel="dns-prefetch" href="https://www.google-analytics.com" />

          <script defer src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-MML-AM_CHTML&locale=uk" />

          <style dangerouslySetInnerHTML={{ __html: styles }} />
        </Head>
        <body className={this.props.raspberriesDay ? 'raspberries' : ''}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

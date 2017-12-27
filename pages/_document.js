import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import styles from '../styles/main.scss';

export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
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
          <style dangerouslySetInnerHTML={{ __html: styles }} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

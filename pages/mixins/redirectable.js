import React from 'react';
import Router from 'next/router';
import API from '../../services/api';

const MOVED_PERMANENTLY_HTTP_CODE = 301;

class RedirectablePage extends React.Component {
  static async getInitialProps({ res, asPath }) {
    try {
      const { docs } = await API.redirects.find({ from: asPath, enabled: true });
      const [redirect] = docs;

      console.log('asPath', asPath);

      if (!redirect) {
        return;
      }

      if (res) {
        res.redirect(MOVED_PERMANENTLY_HTTP_CODE, redirect.to);
      } else {
        Router.replace(redirect.to);
      }
    } catch (error) {
      console.error(error);
    }
  }
}

export default RedirectablePage;

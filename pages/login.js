import React from 'react';
import Head from 'next/head';
import Router from 'next/router';

import Wrapper from '../components/Wrapper';
import Content from '../components/Content';

import Session from '../services/session';

class LoginPage extends React.Component {
  static async getInitialProps({ req, res }) {
    if (Session.isAuthenticated(req)) {
      res.redirect('/');
    }

    return {};
  }

  constructor(props) {
    super(props);

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.setPassword = this.setPassword.bind(this);
    this.authenticate = this.authenticate.bind(this);
  }

  setPassword(event) {
    this.setState({ password: event.target.value });
  }

  async handleKeyPress(event) {
    if (event.which === 13) {
      this.authenticate();
    }
  }

  async authenticate() {
    return Session.authenticate({ login: 'poohitan', password: this.state.password })
      .then(() => Router.push('/'));
  }

  render() {
    return (
      <Wrapper>
        <Head>
          <title>Вхід у Нарнію</title>
        </Head>
        <Content>
          <h1 className="text-center">Вхід у Нарнію</h1>
          <div className="fatty layout-row layout-align-center-center">
            <input type="password" onChange={this.setPassword} onKeyPress={this.handleKeyPress} />
          </div>
        </Content>
      </Wrapper>
    );
  }
}

export default LoginPage;

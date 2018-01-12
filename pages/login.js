import React from 'react';
import Head from 'next/head';
import Router from 'next/router';

import Wrapper from '../components/Wrapper';
import Content from '../components/Content';

import Session from '../services/session';

const LOGIN_ATTEMPTS_MESSAGES = [
  'Пішов геть.',
  'Тобі треба два рази повторювати?',
  'В Нарнії такі як ти нікому не потрібні.',
  'Не доходить?',
  'Вали давай.',
  'Ти шо, припуцькнутий?',
  'Ше одна спроба, і за тобою виїдуть.',
  'Хочеш, шоб тобі зламали ноги?',
  'Це можна влаштувати.',
  'Ти сам підписав смертний вирок своїм ногам.',
  'Бачу, тобі дико немає чим зайнятись. Краще б уроки повчив.',
  'Ти тут сидиш і підбираєш пароль до сайту, де ВЗАГАЛІ нема нічого корисного.',
  'Не найрозумніше заняття.',
  'А поки ти це робиш, твоє життя минає.',
  'Секунда за секундою, хвилина за хвилиною.',
  'Цей день може бути останнім у твоєму житті, а ти проводиш його отак.',
  'YOLO, загугли.',
  'Насправді в мене теж є чим зайнятись, все-таки я Node.js сервер.',
  'Я ціную свій час.',
  'А ти продовжуй марнувати своє життя.',
  'Бувай, бовдуре.',
];

class LoginPage extends React.Component {
  static async getInitialProps({ req, res }) {
    if (Session.isAuthenticated(req)) {
      res.redirect('/');
    }

    return {};
  }

  constructor(props) {
    super(props);

    this.state = {
      failedLoginAttempts: 0,
    };

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
      .then(() => Router.push('/'))
      .catch((error) => {
        if (error.status === 403) {
          this.setState({
            error: LOGIN_ATTEMPTS_MESSAGES[this.state.failedLoginAttempts],
            failedLoginAttempts: this.state.failedLoginAttempts + 1,
          });
        }
      });
  }

  render() {
    return (
      <Wrapper>
        <Head>
          <title>Вхід у Нарнію</title>
        </Head>
        <Content>
          <h1 className="text-center">Вхід у Нарнію</h1>
          <div className="fatty layout-row layout-wrap layout-align-center-center">
            <input type="password" onChange={this.setPassword} onKeyPress={this.handleKeyPress} />
            {this.state.error && <p className="flex-100 text-center">{this.state.error}</p>}
          </div>
        </Content>
      </Wrapper>
    );
  }
}

export default LoginPage;

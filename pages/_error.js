import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { current } from '../config';
import Wrapper from '../components/Wrapper';
import Header from '../components/Header';
import Content from '../components/Content';
import Footer from '../components/Footer';
import TagCloud from '../components/TagCloud';

class Error extends React.Component {
  static getInitialProps({ res, error }) {
    const statusCode = (res && res.statusCode) || (error && error.statusCode);

    if (current.environment !== 'production') {
      console.error(error);
    }

    return { statusCode };
  }

  render() {
    let message = 'Шось пішло не так…';

    if (this.props.statusCode) {
      message += ` Код помилки: ${this.props.statusCode}`;
    }

    return (
      <Wrapper>
        <Head>
          <title>Сталась помилка - {current.meta.title}</title>
        </Head>
        <Header />
        <Content>
          <h1>Сталась помилка</h1>
          <p>{message}</p>
          <TagCloud />
        </Content>
        <Footer />
      </Wrapper>
    );
  }
}

Error.propTypes = {
  statusCode: PropTypes.number,
};

Error.defaultProps = {
  statusCode: null,
};

export default Error;

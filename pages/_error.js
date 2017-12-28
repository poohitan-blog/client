import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Wrapper from '../components/Wrapper';
import Header from '../components/Header';
import Content from '../components/Content';
import Footer from '../components/Footer';

class Error extends React.Component {
  static getInitialProps({ res, error }) {
    const statusCode = (res && res.statusCode) || (error && error.statusCode);

    return { statusCode };
  }

  render() {
    return (
      <Wrapper>
        <Head>
          <title>Сталась помилка - poohitan</title>
        </Head>
        <Header />
        <Content>
          <h1>Сталась помилка</h1>
          <p>Шось пішло не так… Код помилки: {this.props.statusCode}</p>
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

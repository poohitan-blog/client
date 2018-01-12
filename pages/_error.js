import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { current } from '../config';
import * as Grammar from '../services/grammar';
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
    let message = Grammar.describeHTTPCode(this.props.statusCode);

    if (current.environment !== 'production') {
      message += ` Код помилки: ${this.props.statusCode}`;
    }

    return (
      <Wrapper>
        <Head>
          <title>Шось пішло не так - {current.meta.title}</title>
        </Head>
        <Header />
        <Content>
          <h1>Шось пішло не так</h1>
          <p className="fatty larger text-center">{message}</p>
          <div className="text-center">
            <p>Хмаринка теґів:</p>
            <TagCloud shake width="90%" />
          </div>
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

import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

import { current } from 'Config';

import { describeHTTPCode } from 'Services/grammar';

import Wrapper from 'Components/Wrapper';
import Header from 'Components/Header';
import Content from 'Components/Content';
import Footer from 'Components/Footer';
import TagCloud from 'Components/TagCloud';

class Error extends React.Component {
  static getInitialProps({ res, error }) {
    const statusCode = (res && res.statusCode) || (error && error.statusCode);

    if (current.environment !== 'production') {
      console.error(error);
    }

    return { statusCode };
  }

  render() {
    const { statusCode } = this.props;

    let message = describeHTTPCode(statusCode);

    if (statusCode && current.environment !== 'production') {
      message += ` HTTP код помилки: ${statusCode}`;
    }

    return (
      <Wrapper>
        <Head>
          <title>{`От халепа - ${current.meta.title}`}</title>
        </Head>
        <Header />
        <Content>
          <h1>От халепа</h1>
          <p className="fatty larger error text-center">{message}</p>
          <div className="text-center">
            <p>Хмаринка позначок:</p>
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

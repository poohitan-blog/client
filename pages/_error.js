import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Wrapper from '../components/Wrapper';

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
        <div className="page-body">
          <h1>Сталась помилка</h1>
          <p>Шось пішло не так… {this.props.statusCode}</p>
        </div>
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

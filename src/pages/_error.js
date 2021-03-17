import React from 'react';
import PropTypes from 'prop-types';
import { NextSeo } from 'next-seo';

import { current } from 'config';

import { describeHTTPCode } from 'services/grammar';
import random from 'helpers/random';

import Wrapper from 'components/Wrapper';
import Header from 'components/Header';
import Content from 'components/Content';
import Footer from 'components/Footer';
import TagCloud from 'components/TagCloud';

const ERROR_TITLES = [
  'От халепа',
  'Святе трясця!',
  'Ой, леле!',
  'Лишенько',
  'Чорт забирай',
  'Дідько!',
];

function Error({ statusCode }) {
  let message = describeHTTPCode(statusCode);

  if (statusCode && current.environment !== 'production') {
    message += ` HTTP код помилки: ${statusCode}`;
  }

  const errorTitle = ERROR_TITLES[random({ min: 0, max: ERROR_TITLES.length - 1 })];

  return (
    <Wrapper>
      <NextSeo title={errorTitle} />
      <Header />
      <Content>
        <h1>{errorTitle}</h1>
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

Error.getInitialProps = function getInitialProps({ res, error }) {
  const statusCode = res?.statusCode || error?.statusCode;

  if (current.environment !== 'production') {
    console.error(error);
  }

  return { statusCode };
};

Error.propTypes = {
  statusCode: PropTypes.number,
};

Error.defaultProps = {
  statusCode: null,
};

export default Error;

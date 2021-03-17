import React, { useState } from 'react';
import { useRouter } from 'next/router';

import { NextSeo } from 'next-seo';
import { signIn, getSession } from 'next-auth/client';

import Wrapper from 'components/Wrapper';
import Content from 'components/Content';

import styles from 'styles/pages/login.module.scss';

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
  'Насправді в мене теж є чим зайнятись, все-таки я Node.js сервер.',
  'Я ціную свій час.',
  'А ти продовжуй марнувати своє життя.',
  'Бувай, бовдуре.',
];

function LoginPage() {
  const [errorMessage, setErrorMessage] = useState('');
  const [password, setPassword] = useState('');
  const [failedLoginAttemptsCount, setFailedLoginAttemptsCount] = useState(0);
  const router = useRouter();

  async function authenticate() {
    try {
      await signIn('credentials', {
        login: 'poohitan',
        password,
        redirect: false,
      });

      router.push('/');
    } catch (error) {
      setErrorMessage(LOGIN_ATTEMPTS_MESSAGES[failedLoginAttemptsCount]);
      setFailedLoginAttemptsCount(failedLoginAttemptsCount + 1);
    }
  }

  async function handleKeyPress(event) {
    if (event.which === 13) {
      authenticate();
    }
  }

  async function handleChange(event) {
    setPassword(event.target.value);
  }

  return (
    <Wrapper showSidebar={false}>
      <NextSeo title="Вхід у Нарнію" />
      <Content>
        <h1 className={styles.header}>Вхід у Нарнію</h1>
        <div className={styles.container}>
          <input type="password" onChange={handleChange} onKeyPress={handleKeyPress} />
          {
            errorMessage
              ? <p className={styles.error}>{errorMessage}</p>
              : null
          }
        </div>
      </Content>
    </Wrapper>
  );
}

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return { props: {} };
}

export default LoginPage;

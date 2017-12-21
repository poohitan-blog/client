import Head from 'next/head';
import Header from './Header';
import Wrapper from './Wrapper';
import styles from 'styles/main.scss';

export default (props) => (
  <div>
    <Head>
      <title>poohitan</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" key="viewport"/>
      <meta http-equiv="content-type" content="text/html; charset=utf-8"/>
      <link rel="icon" href="/static/icons/favicon.ico" type="image/x-icon" />
      <style>{styles}</style>
    </Head>

    <Wrapper>
      {props.children}
    </Wrapper>
  </div>
)

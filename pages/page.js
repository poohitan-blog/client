import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Wrapper from '../components/Wrapper';
import API from '../services/api';

class PagePage extends React.Component {
  static async getInitialProps({ query }) {
    const page = await API.pages.findByPath(query.path);

    return { page };
  }

  render() {
    const markup = { __html: this.props.page.body };

    return (
      <Wrapper>
        <Head>
          <title>{this.props.page.title} - poohitan</title>
        </Head>
        <div className="page-body" dangerouslySetInnerHTML={markup} />
      </Wrapper>
    );
  }
}

PagePage.propTypes = {
  page: PropTypes.shape({
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
  }).isRequired,
};

export default PagePage;

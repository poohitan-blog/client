import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Error from './_error';
import Wrapper from '../components/Wrapper';
import API from '../services/api';

class PagePage extends React.Component {
  static async getInitialProps({ query }) {
    try {
      const page = await API.pages.findByPath(query.path);

      return { page };
    } catch (error) {
      return { error };
    }
  }

  render() {
    if (this.props.error) {
      return <Error statusCode={this.props.error.status} />;
    }

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
  }),

  error: PropTypes.shape({
    status: PropTypes.number,
  }),
};

PagePage.defaultProps = {
  page: {},
  error: null,
};

export default PagePage;

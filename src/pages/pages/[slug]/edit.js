import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';
import { parseCookies } from 'nookies';

import { current } from 'Config';
import API from 'Services/api';
import Error from 'Pages/_error';

import withSession from 'Hocs/withSession';
import withProtection from 'Hocs/withProtection';
import Wrapper from 'Components/Wrapper';
import Header from 'Components/Header';
import Content from 'Components/Content';
import PageForm from 'Components/admin/PageForm';

class EditPage extends React.Component {
  static async getInitialProps({ req, query }) {
    try {
      const { slug } = query;

      if (!slug) {
        return {};
      }

      const page = await API.pages.findOne(slug, parseCookies({ req }));

      return { page };
    } catch (error) {
      return { error };
    }
  }

  constructor(props) {
    super(props);

    this.state = props.page || {};

    this.getPageLinkMarkup = this.getPageLinkMarkup.bind(this);
    this.submit = this.submit.bind(this);
  }

  getPageLinkMarkup() {
    const { page } = this.props;
    const { slug: currentSlug } = page;
    const { slug: newSlug } = this.state;

    const prefix = `${current.clientURL}`;
    const slug = currentSlug || newSlug || '';
    const fullLink = `${prefix}/${slug}`;
    const isNewpage = !currentSlug;

    if (isNewpage) {
      return <span>{fullLink}</span>;
    }

    return <Link as={`/${slug}`} href="/[slug]"><a>{fullLink}</a></Link>;
  }

  async submit(submittedPage) {
    const { page } = this.props;

    const savedPage = page.id
      ? await API.pages.update(page.slug, submittedPage, parseCookies({}))
      : await API.pages.create(submittedPage, parseCookies({}));

    Router.push('/[slug]', `/${savedPage.slug}`);
  }

  render() {
    const { page, error } = this.props;

    if (error) {
      return <Error statusCode={error.status} />;
    }

    const title = page.id ? 'Редагувати сторінку' : 'Додати сторінку';

    return (
      <Wrapper>
        <Head>
          <title>{title}</title>
        </Head>
        <Header />
        <Content>
          <PageForm
            id={page.id}
            title={page.title}
            body={page.body}
            slug={page.slug}
            hidden={page.hidden}
            customStyles={page.customStyles}
            key={page.slug}
            onChange={(value) => this.submit(value)}
          />
        </Content>
      </Wrapper>
    );
  }
}

EditPage.propTypes = {
  page: PropTypes.shape({
    id: PropTypes.string,
    slug: PropTypes.string,
    title: PropTypes.string,
    body: PropTypes.string,
    hidden: PropTypes.bool,
    customStyles: PropTypes.string,
  }),

  error: PropTypes.shape({
    status: PropTypes.number,
  }),
};

EditPage.defaultProps = {
  page: {},
  error: null,
};

export default withProtection(withSession(EditPage));

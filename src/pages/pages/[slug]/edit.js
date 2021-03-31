import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';

import API from 'services/api';

import Wrapper from 'components/Wrapper';
import Header from 'components/Header';
import Content from 'components/Content';
import PageForm from 'components/admin/PageForm';
import checkAdminAccess from 'utils/check-admin-access';

function EditPage({ page }) {
  const title = page.id ? 'Редагувати сторінку' : 'Додати сторінку';

  const router = useRouter();

  async function submit(submittedPage) {
    const savedPage = page.id
      ? await API.pages.update(page.slug, submittedPage, parseCookies({}))
      : await API.pages.create(submittedPage, parseCookies({}));

    router.push('/[slug]', `/${savedPage.slug}`);
  }

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
          onChange={(value) => submit(value)}
        />
      </Content>
    </Wrapper>
  );
}

export async function getServerSideProps({ req, res, query }) {
  try {
    const hasAccess = await checkAdminAccess({ req });

    if (!hasAccess) {
      return {
        props: {
          errorCode: 401,
        },
      };
    }

    const { slug } = query;

    if (!slug) {
      return {
        props: {},
      };
    }

    const page = await API.pages.findOne(slug, parseCookies({ req }));

    return {
      props: {
        page,
      },
    };
  } catch (error) {
    const { statusCode = 500 } = error;

    res.statusCode = statusCode;

    return {
      props: {
        errorCode: statusCode,
      },
    };
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
};

EditPage.defaultProps = {
  page: {},
};

export default EditPage;

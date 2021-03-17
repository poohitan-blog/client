import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';

import API from 'services/api';

import Wrapper from 'components/Wrapper';
import Header from 'components/Header';
import Content from 'components/Content';
import TrashPostForm from 'components/admin/TrashPostForm';
import checkAdminAccess from 'utils/check-admin-access';

function EditTrashPost({ trashPost }) {
  const title = trashPost.id ? 'Редагувати запис' : 'Додати запис у смітник';
  const router = useRouter();

  async function submit(submittedTrashPost) {
    const savedTrashPost = submittedTrashPost.id
      ? await API.trashPosts.update(trashPost.id, submittedTrashPost, parseCookies({}))
      : await API.trashPosts.create(submittedTrashPost, parseCookies({}));

    router.push('/trash/[id]', `/trash/${savedTrashPost.shortId}`);
  }

  return (
    <Wrapper>
      <Head>
        <title>{title}</title>
      </Head>
      <Header />
      <Content>
        <TrashPostForm
          id={trashPost.id}
          body={trashPost.body}
          key={trashPost.id}
          onChange={submit}
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

    if (!query.id) {
      return {
        props: {},
      };
    }

    const trashPost = await API.trashPosts.findOne(query.id, parseCookies({ req }));

    return {
      props: {
        trashPost,
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

EditTrashPost.propTypes = {
  trashPost: PropTypes.shape({
    id: PropTypes.string,
    body: PropTypes.string,
  }),
  error: PropTypes.shape({
    status: PropTypes.number,
  }),
};

EditTrashPost.defaultProps = {
  trashPost: {},
  error: null,
};

export default EditTrashPost;

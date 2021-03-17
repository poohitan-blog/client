import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';

import API from 'services/api';

import Wrapper from 'components/Wrapper';
import Header from 'components/Header';
import Content from 'components/Content';
import PostTranslationForm from 'components/admin/PostTranslationForm';
import checkAdminAccess from 'utils/check-admin-access';

function EditPostTranslation({ post, translation }) {
  const title = translation.id ? 'Редагувати переклад' : 'Додати переклад';
  const router = useRouter();

  async function submit(submittedTranslation) {
    if (submittedTranslation.id) {
      await API.postTranslations.update(translation.id, submittedTranslation, parseCookies({}));
    } else {
      const newTranslation = await API.postTranslations.create(submittedTranslation, parseCookies({}));
      const updatedListOfTranslations = [...post.translations.map((item) => item.id || item), newTranslation.id];

      await API.posts.update(post.slug, { ...post, translations: updatedListOfTranslations });
    }

    router.push('/p/[slug]/[language]', `/p/${post.slug}/${submittedTranslation.lang}`);
  }

  return (
    <Wrapper>
      <Head>
        <title>{title}</title>
      </Head>
      <Header />
      <Content>
        <PostTranslationForm
          translation={translation}
          post={post}
          key={translation.id}
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

    const post = await API.posts.findOne(query.slug, parseCookies({ req }));

    if (!query.language) {
      return {
        props: {
          post,
        },
      };
    }

    const translationId = post.translations.find((translation) => translation.lang === query.language).id;
    const translation = await API.postTranslations.findOne(translationId, parseCookies({ req }));

    return {
      props: {
        translation,
        post,
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

EditPostTranslation.propTypes = {
  translation: PropTypes.shape({
    id: PropTypes.string,
  }),
  post: PropTypes.shape({
    slug: PropTypes.string,
    translations: PropTypes.arrayOf(PropTypes.oneOf(PropTypes.string, PropTypes.objectOf(PropTypes.string))),
  }).isRequired,
};

EditPostTranslation.defaultProps = {
  translation: {},
};

export default EditPostTranslation;

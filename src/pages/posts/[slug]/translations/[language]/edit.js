import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Router from 'next/router';
import { parseCookies } from 'nookies';

import API from 'services/api';
import Error from 'pages/_error';

import withSession from 'hocs/withSession';
import withProtection from 'hocs/withProtection';
import Wrapper from 'components/Wrapper';
import Header from 'components/Header';
import Content from 'components/Content';
import PostTranslationForm from 'components/admin/PostTranslationForm';

class EditPostTranslation extends React.Component {
  static async getInitialProps({ req, query }) {
    try {
      const post = await API.posts.findOne(query.slug, parseCookies({ req }));

      if (!query.language) {
        return { post };
      }

      const translationId = post.translations.find((translation) => translation.lang === query.language).id;
      const translation = await API.postTranslations.findOne(translationId, parseCookies({ req }));

      return { translation, post };
    } catch (error) {
      return { error };
    }
  }

  constructor(props) {
    super(props);

    this.submit = this.submit.bind(this);
  }

  async submit(submittedTranslation) {
    const { post, translation } = this.props;

    if (submittedTranslation.id) {
      await API.postTranslations.update(translation.id, submittedTranslation, parseCookies({}));
    } else {
      const newTranslation = await API.postTranslations.create(submittedTranslation, parseCookies({}));
      const updatedListOfTranslations = [...post.translations.map((item) => item.id || item), newTranslation.id];

      await API.posts.update(post.slug, { ...post, translations: updatedListOfTranslations });
    }

    Router.push('/p/[slug]/[language]', `/p/${post.slug}/${submittedTranslation.lang}`);
  }

  render() {
    const {
      post,
      translation,
      error,
    } = this.props;

    if (error) {
      return <Error statusCode={error.status} />;
    }

    const title = translation.id ? 'Редагувати переклад' : 'Додати переклад';

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
            onChange={(updatedTranslation) => this.submit(updatedTranslation)}
          />
        </Content>
      </Wrapper>
    );
  }
}

EditPostTranslation.propTypes = {
  translation: PropTypes.shape({
    id: PropTypes.string,
  }),
  post: PropTypes.shape({
    slug: PropTypes.string,
    translations: PropTypes.array,
  }).isRequired,
  error: PropTypes.shape({
    status: PropTypes.number,
  }),
};

EditPostTranslation.defaultProps = {
  translation: {},
  error: null,
};

export default withProtection(withSession(EditPostTranslation));

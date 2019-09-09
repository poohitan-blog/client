import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Router from 'next/router';

import API from '../../services/api';
import Error from '../_error';
import { getAllCookies } from '../../services/cookies';

import ProtectedPage from '../_protected';
import Wrapper from '../../components/Wrapper';
import Header from '../../components/Header';
import Content from '../../components/Content';
import PostTranslationForm from '../../components/admin/PostTranslationForm';

class EditPostTranslation extends ProtectedPage {
  static async getInitialProps({ req, query }) {
    try {
      const parentProps = await super.getInitialProps({ req });
      const post = await API.posts.findOne(query.post, getAllCookies(req));

      if (!query.language) {
        return Object.assign(parentProps, { post });
      }

      const translationId = post.translations.find(translation => translation.lang === query.language)._id; // eslint-disable-line
      const translation = await API.postTranslations.findOne(translationId, getAllCookies(req));

      return Object.assign(parentProps, { translation, post });
    } catch (error) {
      return { error };
    }
  }

  constructor(props) {
    super(props);

    this.submit = this.submit.bind(this);
  }

  async submit(translation) {
    const { post } = this.props;

    if (translation.id) {
      await API.postTranslations.update(this.props.translation.id, translation, getAllCookies());
    } else {
      const newTranslation = await API.postTranslations.create(translation, getAllCookies());
      const updatedListOfTranslations = [...post.translations, newTranslation.id];

      await API.posts.update(post.path, Object.assign({}, post, { translations: updatedListOfTranslations }));
    }

    Router.push(`/post?path=${post.path}&language=${translation.lang}`, `/p/${post.path}?language=${translation.lang}`);
  }

  render() {
    if (this.props.error) {
      return <Error statusCode={this.props.error.status} />;
    }

    const title = this.props.translation.id ? 'Редагувати переклад' : 'Додати переклад';

    return (
      <Wrapper>
        <Head>
          <title>{title}</title>
        </Head>
        <Header />
        <Content>
          <PostTranslationForm
            translation={this.props.translation}
            post={this.props.post}
            key={this.props.translation.id}
            onChange={translation => this.submit(translation)}
          />
        </Content>
      </Wrapper>
    );
  }
}

EditPostTranslation.propTypes = {
  translation: PropTypes.shape({}),
  post: PropTypes.shape({}).isRequired,
};

EditPostTranslation.defaultProps = {
  translation: {},
};

export default EditPostTranslation;

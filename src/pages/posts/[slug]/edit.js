import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Router from 'next/router';
import { parseCookies } from 'nookies';

import API from 'Services/api';
import Error from 'Pages/_error';

import withSession from 'Hocs/withSession';
import withProtection from 'Hocs/withProtection';
import Wrapper from 'Components/Wrapper';
import Header from 'Components/Header';
import Content from 'Components/Content';
import PostForm from 'Components/admin/PostForm';

class EditPost extends React.Component {
  static async getInitialProps({ req, query }) {
    try {
      const tagCloud = await API.tags.getCloud();

      if (!query.slug) {
        return { tagCloud };
      }

      const post = await API.posts.findOne(query.slug, parseCookies({ req }));

      return { post, tagCloud };
    } catch (error) {
      return { error };
    }
  }

  constructor(props) {
    super(props);

    this.submit = this.submit.bind(this);
  }

  async submit(submittedPost) {
    const { post } = this.props;

    const savedPost = submittedPost.id
      ? await API.posts.update(post.slug, submittedPost, parseCookies({}))
      : await API.posts.create(submittedPost, parseCookies({}));

    Router.push('/p/[slug]', `/p/${savedPost.slug}`);
  }

  render() {
    const { post, tagCloud, error } = this.props;

    if (error) {
      return <Error statusCode={error.status} />;
    }

    const title = post.id ? 'Редагувати запис' : 'Додати запис';

    return (
      <Wrapper>
        <Head>
          <title>{title}</title>
        </Head>
        <Header />
        <Content>
          <PostForm
            key={post.slug}
            id={post.id}
            title={post.title}
            slug={post.slug}
            description={post.description}
            body={post.body}
            tags={post.tags}
            tagCloud={tagCloud}
            customStyles={post.customStyles}
            imagesWidth={post.imagesWidth}
            hidden={post.hidden}
            publishedAt={new Date(post.publishedAt)}
            translations={post.translations}
            onChange={(value) => this.submit(value)}
          />
        </Content>
      </Wrapper>
    );
  }
}

EditPost.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string,
    slug: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    body: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    customStyles: PropTypes.string,
    imagesWidth: PropTypes.number,
    hidden: PropTypes.bool,
    publishedAt: PropTypes.string,
    translations: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  tagCloud: PropTypes.shape({}).isRequired,
  error: PropTypes.shape({
    status: PropTypes.number,
  }),
};

EditPost.defaultProps = {
  post: {},
  error: null,
};

export default withProtection(withSession(EditPost));

import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import Checkbox from '../ui/Checkbox';
import Editor from '../../utils/editor';

import styles from '../../styles/components/admin/post-translation-form.scss';

const MAX_DESCRIPTION_LENGTH = 160;

class PostTranslationForm extends React.Component {
  constructor(props) {
    super(props);

    const translationDescription = props.translation.description || '';

    this.state = {
      ...props.translation,
      descriptionSymbolsLeft: MAX_DESCRIPTION_LENGTH - translationDescription.length,
    };

    this.submit = this.submit.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
  }

  async submit() {
    const { title, body } = this.state;

    if (!(title && body)) {
      // TODO: show error popup

      return;
    }

    const { onChange } = this.props;

    onChange(this.state);
  }

  handleDescriptionChange(event) {
    const { value } = event.target;

    this.setState({
      description: value,
      descriptionSymbolsLeft: MAX_DESCRIPTION_LENGTH - value.length,
    });
  }

  render() {
    const {
      id,
      title,
      description,
      body,
      lang,
      hidden,
      descriptionSymbolsLeft,
    } = this.state;
    const { post } = this.props;
    const formTitle = id ? 'Редагувати переклад' : 'Додати переклад';

    return (
      <>
        <h1>
          {formTitle}
          {' '}
          <Link href="/posts/[slug]/edit" as={`/posts/${post.slug}/edit`}>
            <a>{`«${post.title}»`}</a>
          </Link>
        </h1>
        <div className={styles.form}>
          <input
            type="text"
            placeholder="Назва"
            value={title}
            onChange={(event) => this.setState({ title: event.target.value })}
          />
          <div className={styles.language}>
            <input
              type="text"
              value={lang}
              placeholder="ISO 639-1 код мови"
              onChange={(event) => this.setState({ lang: event.target.value })}
            />
          </div>
          <Editor html={body} onChange={(value) => this.setState({ body: value })} />
          <div>
            <div className={styles.shortDescription}>
              <p>Короткий опис:</p>
              <span className="smaller">
                {`Залишилось символів: ${descriptionSymbolsLeft}`}
              </span>
            </div>
            <textarea
              rows="3"
              value={description}
              onChange={(event) => this.handleDescriptionChange(event)}
            />
          </div>
          <div className={styles.footer}>
            <Checkbox
              label="Заховати"
              checked={hidden}
              onChange={(value) => this.setState({ hidden: value })}
            />
            <button type="submit" onClick={this.submit} className={styles.submitButton}>Вйо</button>
          </div>
        </div>
      </>
    );
  }
}

PostTranslationForm.propTypes = {
  translation: PropTypes.shape({
    description: PropTypes.string,
  }),
  post: PropTypes.shape({
    title: PropTypes.string,
    slug: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

PostTranslationForm.defaultProps = {
  translation: {},
};

export default PostTranslationForm;

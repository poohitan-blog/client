import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { format, parse, isValid } from 'date-fns';

import { current } from 'config';

import Checkbox from 'components/ui/Checkbox';
import Editor from 'utils/editor';
import CodeEditor from 'utils/code-editor';
import TagSuggestions from 'components/admin/TagSuggestions';

import styles from 'styles/components/admin/post-form.module.scss';

const DATE_FORMAT = 'dd.MM.yyyy HH:mm';
const MAX_DESCRIPTION_LENGTH = 160;

class PostForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ...props,
      tagsString: props.tags?.length ? props.tags.join(', ') : '',
      dateString: isValid(props.publishedAt) ? format(props.publishedAt, DATE_FORMAT) : '',
      translations: props.translations || [],
      descriptionSymbolsLeft: MAX_DESCRIPTION_LENGTH - props.description.length,
    };

    this.handleTagsChange = this.handleTagsChange.bind(this);
    this.addTag = this.addTag.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.getPostLinkMarkup = this.getPostLinkMarkup.bind(this);
    this.submit = this.submit.bind(this);
  }

  handleTagsChange(event) {
    this.setState({
      tagsString: event.target.value,
    });
  }

  handleDateChange(event) {
    this.setState({
      dateString: event.target.value,
    });
  }

  handleDescriptionChange(event) {
    const { value } = event.target;

    this.setState({
      description: value,
      descriptionSymbolsLeft: MAX_DESCRIPTION_LENGTH - value.length,
    });
  }

  getPostLinkMarkup() {
    const { id, slug: propsSlug } = this.props;
    const { slug: stateSlug } = this.state;
    const prefix = `${current.clientURL}/p`;
    const slug = stateSlug || propsSlug || '';
    const fullLink = `${prefix}/${slug}`;
    const isNewPost = !id;

    if (isNewPost) {
      return <span>{fullLink}</span>;
    }

    return <Link href={`/p/${slug}`}><a>{fullLink}</a></Link>;
  }

  async submit() {
    const {
      title,
      body,
      tagsString,
      dateString,
      translations,
    } = this.state;

    if (!(title && body)) {
      // TODO: show error popup

      return;
    }

    const tags = tagsString.split(',').map((tag) => tag.trim()).filter((tag) => tag !== '');
    const publishedAt = dateString ? parse(dateString, DATE_FORMAT, new Date()) : new Date();
    const preparedTranslations = translations.map((translation) => translation.id || translation);

    const { onChange } = this.props;

    onChange({
      ...this.state,
      tags,
      publishedAt,
      translations: preparedTranslations,
    });
  }

  addTag(value) {
    const { tagsString } = this.state;

    if (tagsString.includes(value)) {
      return;
    }

    const tags = [
      ...tagsString
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag !== ''),
      value,
    ];

    this.setState({
      tagsString: tags.join(', '),
    });
  }

  render() {
    const {
      title,
      description,
      slug,
      body,
      tagsString,
      dateString,
      translations,
      customStyles,
      imagesWidth,
      descriptionSymbolsLeft,
      hidden,
    } = this.state;
    const { id, tagCloud } = this.props;
    const formTitle = id ? 'Редагувати запис' : 'Додати запис';
    const link = this.getPostLinkMarkup();

    return (
      <div className={styles.wrapper}>
        <h1>{formTitle}</h1>
        <div className={styles.form}>
          <input
            type="text"
            placeholder="Назва"
            value={title}
            onChange={(event) => this.setState({ title: event.target.value })}
          />
          <div className={styles.slug}>
            <input
              type="text"
              value={slug}
              placeholder="Адреса"
              onChange={(event) => this.setState({ slug: event.target.value })}
              className={styles.slugInput}
            />
            <div className={styles.slugPreview}>
              {link}
            </div>
          </div>
          <Editor html={body} onChange={(value) => this.setState({ body: value })} />
          <div>
            <p>Позначки (через кому):</p>
            <input
              type="text"
              value={tagsString}
              onChange={this.handleTagsChange}
            />
            <TagSuggestions tags={tagCloud} onClick={this.addTag} />
          </div>
          <hr className={styles.separator} />
          <div>
            <div className={styles.shortDescription}>
              <p>Короткий опис:</p>
              <span className="smaller">{`Залишилось символів: ${descriptionSymbolsLeft}`}</span>
            </div>
            <textarea
              rows="3"
              value={description}
              onChange={(event) => this.handleDescriptionChange(event)}
            />
          </div>
          <div>
            <p>Стилі сторінки:</p>
            <CodeEditor
              value={customStyles}
              onInput={(value) => this.setState({ customStyles: value })}
              language="scss"
            />
          </div>
          {
            customStyles
              ? (
                <div>
                  <span className="nowrap">Ширина зображень (у нерозгорнутому вигляді):</span>
                  <input
                    type="number"
                    min={100}
                    max={5000}
                    value={imagesWidth}
                    onChange={(event) => this.setState({ imagesWidth: event.target.value })}
                    className="margin-left"
                  />
                </div>
              )
              : null
          }
          <hr className={styles.separator} />
          <div className={styles.translations}>
            <p>Переклади:</p>
            {
              translations?.length
                ? translations
                  .map((translation) => (
                    <Link
                      key={translation.lang}
                      href={`/posts/${slug}/translations/${translation.lang}/edit`}
                    >
                      <a className={styles.translationLink}>
                        {translation.lang}
                        {translation.hidden ? <sup>(прих.)</sup> : null}
                      </a>
                    </Link>
                  ))
                : null
            }
            <Link href={`/posts/${slug}/translations/new`}>
              <a className={styles.translationLink}>(Додати)</a>
            </Link>
          </div>
          <div className={styles.footer}>
            <div className={styles.options}>
              <input
                type="text"
                placeholder="DD.MM.YYYY HH:mm"
                value={dateString}
                onChange={this.handleDateChange}
                pattern="[0-3][0-9]\.[0-1][0-9]\.[1-2][0-9][0-9][0-9] [0-2][0-9]:[0-5][0-9]"
                className={styles.date}
              />
              <Checkbox
                label="Заховати"
                checked={hidden}
                onChange={(value) => this.setState({ hidden: value })}
              />
            </div>
            <button type="submit" onClick={this.submit} className={styles.submitButton}>Вйо</button>
          </div>
        </div>
      </div>
    );
  }
}

PostForm.propTypes = {
  id: PropTypes.string,
  slug: PropTypes.string,
  description: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  tagCloud: PropTypes.shape({}).isRequired,
  publishedAt: PropTypes.instanceOf(Date),
  translations: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func.isRequired,
};

PostForm.defaultProps = {
  id: '',
  slug: '',
  description: '',
  tags: [],
  publishedAt: null,
  translations: [],
};

export default PostForm;

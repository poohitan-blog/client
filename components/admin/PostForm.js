import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { format, parse, isValid } from 'date-fns';
import { Controlled as CodeMirror } from 'react-codemirror2';
import codeMirrorStyles from 'codemirror/lib/codemirror.css';
import codeMirrorThemeStyles from 'codemirror/theme/monokai.css';

import { current } from '../../config';

import Checkbox from '../ui/Checkbox';
import Editor from '../../utils/editor';
import TagSuggestions from './TagSuggestions';

import styles from '../../styles/components/admin/post-form.scss';

try {
  require('codemirror/mode/css/css');
} catch (error) {
  console.error(error);
}

const DATE_FORMAT = 'dd.MM.yyyy HH:mm';
const MAX_DESCRIPTION_LENGTH = 160;

class PostForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ...props,
      tagsString: props.tags && props.tags.length ? props.tags.join(', ') : '',
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

  getPostLinkMarkup() {
    const { id, path: propsPath } = this.props;
    const { path: statePath } = this.state;
    const prefix = `${current.clientURL}/p`;
    const path = propsPath || statePath || '';
    const fullLink = `${prefix}/${path}`;
    const isNewPost = !id;

    if (isNewPost) {
      return <span>{fullLink}</span>;
    }

    return <Link as={`/p/${path}`} href="/p/[slug]"><a>{fullLink}</a></Link>;
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

  render() {
    const {
      title,
      description,
      path,
      body,
      tagsString,
      dateString,
      translations,
      customStyles,
      imagesWidth,
      descriptionSymbolsLeft,
      private: hidden,
    } = this.state;
    const { id, tagCloud } = this.props;
    const formTitle = id ? 'Редагувати запис' : 'Додати запис';
    const link = this.getPostLinkMarkup();

    return (
      <div className={styles.wrapper}>
        <style>{codeMirrorStyles + codeMirrorThemeStyles}</style>
        <h1>{formTitle}</h1>
        <div className={styles.form}>
          <input
            type="text"
            placeholder="Назва"
            value={title}
            onChange={(event) => this.setState({ title: event.target.value })}
          />
          <div className={styles.path}>
            <input
              type="text"
              value={path}
              placeholder="Адреса"
              onChange={(event) => this.setState({ path: event.target.value })}
              className={styles.pathInput}
            />
            <div className={styles.pathPreview}>
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
            <CodeMirror
              value={customStyles}
              options={{
                mode: 'css',
                theme: 'monokai',
              }}
              onBeforeChange={(editor, data, value) => this.setState({ customStyles: value })}
              className={`${styles.codeEditor} ${customStyles ? '' : styles.collapsed}`}
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
              translations && translations.length
                ? translations
                  .map((translation) => (
                    <Link
                      key={translation.lang}
                      as={`/posts/${path}/translations/${translation.lang}/edit`}
                      href="/posts/[slug]/translations/[language]/edit"
                    >
                      <a className={styles.translationLink}>
                        {translation.lang}
                        {translation.private ? <sup>(прих.)</sup> : null}
                      </a>
                    </Link>
                  ))
                : null
            }
            <Link as={`/posts/${path}/translations/new`} href="/posts/[slug]/translations/new">
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
                onChange={(value) => this.setState({ private: value })}
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
  path: PropTypes.string,
  description: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  tagCloud: PropTypes.shape({}).isRequired,
  publishedAt: PropTypes.instanceOf(Date),
  translations: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func.isRequired,
};

PostForm.defaultProps = {
  id: '',
  path: '',
  description: '',
  tags: [],
  publishedAt: null,
  translations: [],
};

export default PostForm;

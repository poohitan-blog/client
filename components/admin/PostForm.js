import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import moment from 'moment';
import { Controlled as CodeMirror } from 'react-codemirror2';
import codeMirrorStyles from 'codemirror/lib/codemirror.css';
import codeMirrorThemeStyles from 'codemirror/theme/monokai.css';

import { current } from '../../config';

import Checkbox from '../ui/Checkbox';
import Editor from '../../utils/editor';

try {
  require('codemirror/mode/css/css');
} catch (error) {
  console.error(error);
}

const DATE_FORMAT = 'DD.MM.YYYY HH:mm';
const MAX_DESCRIPTION_LENGTH = 160;

class PostForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ...props,
      tagsString: props.tags && props.tags.length ? props.tags.join(', ') : '',
      dateString: props.publishedAt ? moment(props.publishedAt).format(DATE_FORMAT) : '',
      translations: props.translations || [],
      descriptionSymbolsLeft: MAX_DESCRIPTION_LENGTH,
    };

    this.handleTagsChange = this.handleTagsChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.getPostLinkMarkup = this.getPostLinkMarkup.bind(this);
    this.submit = this.submit.bind(this);
  }

  getPostLinkMarkup() {
    const prefix = `${current.clientURL}/p`;
    const path = this.props.path || this.state.path || '';
    const fullLink = `${prefix}/${path}`;
    const isNewPost = !this.props.id;

    if (isNewPost) {
      return <span>{fullLink}</span>;
    }

    return <Link as={`/p/${path}`} href={`/post?path=${path}`}><a>{fullLink}</a></Link>;
  }

  async submit() {
    if (!(this.state.title && this.state.body)) {
      // TODO: show error popup

      return;
    }

    const tags = this.state.tagsString.split(',').map(tag => tag.trim());
    const publishedAt = this.state.dateString ? moment(this.state.dateString, DATE_FORMAT).toDate() : new Date();
    const translations = this.state.translations.map(translation => translation.id || translation);

    this.props.onChange(Object.assign({}, this.state, { tags, publishedAt, translations }));
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
      path,
      body,
      tagsString,
      dateString,
      translations,
      customStyles,
      descriptionSymbolsLeft,
    } = this.state;
    const formTitle = this.props.path ? 'Редагувати запис' : 'Додати запис';
    const link = this.getPostLinkMarkup();

    return (
      <div className="post-form">
        <style dangerouslySetInnerHTML={{ __html: codeMirrorStyles + codeMirrorThemeStyles }} />
        <h1>{formTitle}</h1>
        <div className="form">
          <input
            type="text"
            placeholder="Назва"
            value={title}
            onChange={event => this.setState({ title: event.target.value })}
          />
          <div className="post-form-path smaller layout-row layout-align-start-center">
            <input
              type="text"
              value={path}
              placeholder="Адреса"
              onChange={event => this.setState({ path: event.target.value })}
              className="flex-50"
            />
            <div className="nowrap text-overflow-ellipsis margin-left flex-50">
              {link}
            </div>
          </div>
          <Editor html={body} onChange={updatedBody => this.setState({ body: updatedBody })} />
          <div>
            <p>Стилі сторінки:</p>
            <CodeMirror
              value={customStyles}
              options={{
                mode: 'css',
                theme: 'monokai',
              }}
              onBeforeChange={(editor, data, value) => {
                this.setState({ customStyles: value });
              }}
              className={`code-editor ${customStyles ? '' : 'collapsed'}`}
            />
          </div>
          <div>
            <div className="layout-row layout-align-space-between-center">
              <p>Короткий опис:</p>
              <span className="smaller">Залишилось символів: {descriptionSymbolsLeft}</span>
            </div>
            <textarea
              rows="3"
              value={this.state.description}
              onChange={event => this.handleDescriptionChange(event)}
            />
          </div>
          <div>
            <p>Позначки (через кому):</p>
            <input
              type="text"
              value={tagsString}
              onChange={this.handleTagsChange}
            />
          </div>
          <div className="layout-row layout-wrap layout-align-center-center">
            <p>Переклади:</p>
            {
              translations && translations.length
                ? translations
                    .map(translation => (
                      <Link
                        as={`/p/${path}/translations/${translation.lang}/edit`}
                        href={`/admin/edit-post-translation?language=${translation.lang}&post=${path}`}
                      >
                        <a className="post-translation-link">
                          {translation.lang}{translation.private ? <sup>(прих.)</sup> : null}
                        </a>
                      </Link>
                    ))
                : null
            }
            <Link as={`/p/${path}/translations/new`} href={`/admin/edit-post-translation?post=${path}`}>
              <a className="post-translation-link">(Додати)</a>
            </Link>
          </div>
          <div className="layout-row layout-align-space-between-center flex-100">
            <div className="layout-row layout-align-start-center flex-50">
              <input
                type="text"
                placeholder="DD.MM.YYYY HH:mm"
                value={dateString}
                onChange={this.handleDateChange}
                pattern="[0-3][0-9]\.[0-1][0-9]\.[1-2][0-9][0-9][0-9] [0-2][0-9]:[0-5][0-9]"
                className="text-center flex-50"
              />
              <div className="flex-offset-5">
                <Checkbox
                  label="Заховати"
                  checked={this.state.private}
                  onChange={hidden => this.setState({ private: hidden })}
                />
              </div>
            </div>
            <button onClick={this.submit} className="flex-30">Вйо</button>
          </div>
        </div>
      </div>
    );
  }
}

PostForm.propTypes = {
  id: PropTypes.string,
  path: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  publishedAt: PropTypes.instanceOf(Date),
  translations: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func.isRequired,
};

PostForm.defaultProps = {
  id: '',
  path: '',
  tags: [],
  publishedAt: null,
  translations: [],
};

export default PostForm;

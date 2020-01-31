import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Controlled as CodeMirror } from 'react-codemirror2';
import codeMirrorStyles from 'codemirror/lib/codemirror.css';
import codeMirrorThemeStyles from 'codemirror/theme/monokai.css';

import { current } from '../../config';

import Checkbox from '../ui/Checkbox';
import Editor from '../../utils/editor';

import styles from '../../styles/components/admin/page-form.scss';

try {
  require('codemirror/mode/css/css');
} catch (error) {
  console.error(error);
}

class PageForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = { ...props };

    this.getPageLinkMarkup = this.getPageLinkMarkup.bind(this);
    this.submit = this.submit.bind(this);
  }

  getPageLinkMarkup() {
    const { id, path: propsPath } = this.props;
    const { path: statePath } = this.state;

    const prefix = `${current.clientURL}`;
    const path = propsPath || statePath || '';
    const fullLink = `${prefix}/${path}`;
    const isNewPage = !id;

    if (isNewPage) {
      return <span>{fullLink}</span>;
    }

    return <Link as={`/${path}`} href={`/page?path=${path}`}><a>{fullLink}</a></Link>;
  }

  async submit() {
    const { title, body, path } = this.state;
    const { onChange } = this.props;

    if (!body || (!title && !path)) {
      // TODO: show error popup

      return;
    }

    onChange(this.state);
  }

  render() {
    const { id } = this.props;
    const {
      title,
      path,
      body,
      private: hidden,
      customStyles,
    } = this.state;

    const pageTitle = id ? 'Редагувати сторінку' : 'Додати сторінку';
    const link = this.getPageLinkMarkup();

    return (
      <div className={styles.wrapper}>
        <h1>{pageTitle}</h1>
        <style>{codeMirrorStyles + codeMirrorThemeStyles}</style>
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
          <Editor key={id} html={body} onChange={(value) => this.setState({ body: value })} />
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
          <div className={styles.footer}>
            <Checkbox
              label="Заховати"
              checked={hidden}
              onChange={(value) => this.setState({ private: value })}
            />
            <button type="submit" onClick={this.submit} className={styles.submitButton}>Вйо</button>
          </div>
        </div>
      </div>
    );
  }
}

PageForm.propTypes = {
  id: PropTypes.string,
  path: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

PageForm.defaultProps = {
  id: '',
  path: '',
};

export default PageForm;

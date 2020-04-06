import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import { current } from 'Config';

import Checkbox from 'Components/ui/Checkbox';
import Editor from 'Utils/editor';
import CodeEditor from 'Utils/code-editor';

import styles from 'Styles/components/admin/page-form.module.scss';

class PageForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = { ...props };

    this.getPageLinkMarkup = this.getPageLinkMarkup.bind(this);
    this.submit = this.submit.bind(this);
  }

  getPageLinkMarkup() {
    const { id, slug: propsSlug } = this.props;
    const { slug: stateSlug } = this.state;

    const prefix = `${current.clientURL}`;
    const slug = propsSlug || stateSlug || '';
    const fullLink = `${prefix}/${slug}`;
    const isNewPage = !id;

    if (isNewPage) {
      return <span>{fullLink}</span>;
    }

    return <Link as={`/${slug}`} href="/[slug]"><a>{fullLink}</a></Link>;
  }

  async submit() {
    const { title, body, slug } = this.state;
    const { onChange } = this.props;

    if (!body || (!title && !slug)) {
      // TODO: show error popup

      return;
    }

    onChange(this.state);
  }

  render() {
    const { id } = this.props;
    const {
      title,
      slug,
      body,
      hidden,
      customStyles,
    } = this.state;

    const pageTitle = id ? 'Редагувати сторінку' : 'Додати сторінку';
    const link = this.getPageLinkMarkup();

    return (
      <div className={styles.wrapper}>
        <h1>{pageTitle}</h1>
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
          <Editor key={id} html={body} onChange={(value) => this.setState({ body: value })} />
          <div>
            <p>Стилі сторінки:</p>
            <CodeEditor
              value={customStyles}
              onInput={(value) => this.setState({ customStyles: value })}
              language="scss"
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
      </div>
    );
  }
}

PageForm.propTypes = {
  id: PropTypes.string,
  slug: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

PageForm.defaultProps = {
  id: '',
  slug: '',
};

export default PageForm;

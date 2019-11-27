import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import { current } from '../../config';

import Checkbox from '../ui/Checkbox';
import Editor from '../../utils/editor';

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
    } = this.state;

    const pageTitle = id ? 'Редагувати сторінку' : 'Додати сторінку';
    const link = this.getPageLinkMarkup();

    return (
      <>
        <h1>{pageTitle}</h1>
        <div className="form">
          <input
            type="text"
            placeholder="Назва"
            value={title}
            onChange={(event) => this.setState({ title: event.target.value })}
          />
          <div className="smaller layout-row layout-align-start-center flex-100">
            <input
              type="text"
              value={path}
              placeholder="Адреса"
              onChange={(event) => this.setState({ path: event.target.value })}
              className="flex-50"
            />
            <div className="nowrap text-overflow-ellipsis margin-left flex-50">
              {link}
            </div>
          </div>
          <Editor key={id} html={body} onChange={(value) => this.setState({ body: value })} />
          <div className="layout-row layout-align-space-between-center">
            <Checkbox
              label="Заховати"
              checked={hidden}
              onChange={(value) => this.setState({ private: value })}
            />
            <button type="submit" onClick={this.submit} className="flex-30">Вйо</button>
          </div>
        </div>
      </>
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

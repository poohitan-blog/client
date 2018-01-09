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
    const prefix = `${current.clientURL}`;
    const path = this.props.path || this.state.path || '';
    const fullLink = `${prefix}/${path}`;
    const isNewPage = !this.props.id;

    if (isNewPage) {
      return <span>{fullLink}</span>;
    }

    return <Link as={`/${path}`} href={`/page?path=${path}`}><a>{fullLink}</a></Link>;
  }

  async submit() {
    if (!this.state.body || (!this.state.title && !this.state.path)) {
      // TODO: show error popup

      return;
    }

    this.props.onChange(this.state);
  }

  render() {
    const title = this.props.path ? 'Редагувати сторінку' : 'Додати сторінку';
    const link = this.getPageLinkMarkup();

    return (
      <div className="children-equal-margin-vertical layout-row layout-wrap">
        <h1>{title}</h1>
        <input
          type="text"
          placeholder="Назва"
          value={this.state.title}
          onChange={event => this.setState({ title: event.target.value })}
          className="flex-100"
        />
        <div className="smaller layout-row layout-align-start-center flex-100">
          <input
            type="text"
            value={this.state.path}
            placeholder="Адреса"
            onChange={event => this.setState({ path: event.target.value })}
            className="flex-50"
          />
          <div className="nowrap text-overflow-ellipsis margin-left flex-50">
            {link}
          </div>
        </div>
        <div className="flex-100">
          <Editor key={this.props.path} html={this.state.body} onChange={body => this.setState({ body })} />
        </div>
        <div className="layout-row layout-align-space-between-center flex-100">
          <Checkbox
            label="Заховати"
            checked={this.state.private}
            onChange={hidden => this.setState({ private: hidden })}
          />
          <button onClick={this.submit} className="flex-30">Вйо</button>
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

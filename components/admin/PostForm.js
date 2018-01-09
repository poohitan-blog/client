import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import moment from 'moment';

import { current } from '../../config';

import Checkbox from '../ui/Checkbox';
import Editor from '../../utils/editor';

const DATE_FORMAT = 'DD.MM.YYYY HH:mm';

class PostForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = { ...props };
    this.state.tagsString = props.tags && props.tags.length ? props.tags.join(', ') : '';
    this.state.dateString = props.publishedAt ? moment(props.publishedAt).format(DATE_FORMAT) : '';

    this.handleTagsChange = this.handleTagsChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
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

    this.props.onChange(Object.assign({}, this.state, { tags, publishedAt }));
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

  render() {
    const title = this.props.path ? 'Редагувати запис' : 'Додати запис';
    const link = this.getPostLinkMarkup();

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
          <Editor html={this.state.body} onChange={body => this.setState({ body })} />
        </div>
        <div className="children-equal-margin-vertical layout-row layout-wrap layout-align-center-center flex-100">
          <span>Теґи (через кому):</span>
          <input
            type="text"
            value={this.state.tagsString}
            onChange={this.handleTagsChange}
            className="flex-100"
          />
        </div>
        <div className="layout-row layout-align-space-between-center flex-100">
          <div className="layout-row layout-align-start-center flex-50">
            <input
              type="text"
              placeholder="DD.MM.YYYY HH:mm"
              value={this.state.dateString}
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
    );
  }
}

PostForm.propTypes = {
  id: PropTypes.string,
  path: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  publishedAt: PropTypes.instanceOf(Date),
  onChange: PropTypes.func.isRequired,
};

PostForm.defaultProps = {
  id: '',
  path: '',
  tags: [],
  publishedAt: null,
};

export default PostForm;

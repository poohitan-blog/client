import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import Checkbox from '../ui/Checkbox';
import Editor from '../../utils/editor';

const MAX_DESCRIPTION_LENGTH = 160;

class PostTranslationForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ...props.translation,
      descriptionSymbolsLeft: MAX_DESCRIPTION_LENGTH,
    };

    this.submit = this.submit.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
  }

  async submit() {
    if (!(this.state.title && this.state.body)) {
      // TODO: show error popup

      return;
    }

    this.props.onChange(this.state);
  }

  handleDescriptionChange(event) {
    const { value } = event.target;

    if (value.length > MAX_DESCRIPTION_LENGTH) {
      return;
    }

    this.setState({
      description: value,
      descriptionSymbolsLeft: MAX_DESCRIPTION_LENGTH - value.length,
    });
  }

  render() {
    const {
      id,
      title,
      body,
      lang,
      descriptionSymbolsLeft,
    } = this.state;
    const { post } = this.props;
    const formTitle = id ? 'Редагувати переклад' : 'Додати переклад';

    return (
      <div>
        <h1>{formTitle} <Link href={`/admin/edit-post?path=${post.path}`} as={`/p/${post.path}/edit`}><a>&laquo;{post.title}&raquo;</a></Link></h1>
        <div className="form">
          <input
            type="text"
            placeholder="Назва"
            value={title}
            onChange={event => this.setState({ title: event.target.value })}
          />
          <div className="smaller layout-row layout-align-start-center">
            <input
              type="text"
              value={lang}
              placeholder="ISO 639-1 код мови"
              onChange={event => this.setState({ lang: event.target.value })}
            />
          </div>
          <Editor html={body} onChange={updatedBody => this.setState({ body: updatedBody })} />
          <div>
            <div className="layout-row layout-align-space-between-center">
              <p>Короткий опис:</p>
              <span className="smaller">Залишилось символів: {descriptionSymbolsLeft}</span>
            </div>
            <textarea
              rows="3"
              maxLength={MAX_DESCRIPTION_LENGTH}
              value={this.state.description}
              onChange={event => this.handleDescriptionChange(event)}
            />
          </div>
          <div className="layout-row layout-align-space-between-center">
            <div className="flex-70">
              <Checkbox
                label="Заховати"
                checked={this.state.private}
                onChange={hidden => this.setState({ private: hidden })}
              />
            </div>
            <button onClick={this.submit} className="flex-30">Вйо</button>
          </div>
        </div>
      </div>
    );
  }
}

PostTranslationForm.propTypes = {
  translation: PropTypes.shape({}),
  post: PropTypes.shape({}).isRequired,
  onChange: PropTypes.func.isRequired,
};

PostTranslationForm.defaultProps = {
  translation: {},
};

export default PostTranslationForm;

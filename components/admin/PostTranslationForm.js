import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
// import moment from 'moment';

// import { current } from '../../config';

import Checkbox from '../ui/Checkbox';
import Editor from '../../utils/editor';

class PostTranslationForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = { ...props.translation };

    this.submit = this.submit.bind(this);
  }

  async submit() {
    if (!(this.state.title && this.state.body)) {
      // TODO: show error popup

      return;
    }

    this.props.onChange(this.state);
  }

  render() {
    const {
      id,
      title,
      body,
      lang,
    } = this.state;
    const { post } = this.props;
    const formTitle = id ? 'Редагувати переклад' : 'Додати переклад';

    return (
      <div className="children-equal-margin-vertical layout-row layout-wrap">
        <h1>{formTitle} <Link href={`/admin/edit-post?path=${post.path}`} as={`/p/${post.path}/edit`}><a>&laquo;{post.title}&raquo;</a></Link></h1>
        <input
          type="text"
          placeholder="Назва"
          value={title}
          onChange={event => this.setState({ title: event.target.value })}
          className="flex-100"
        />
        <div className="smaller layout-row layout-align-start-center flex-100">
          <input
            type="text"
            value={lang}
            placeholder="ISO 639-1 код мови"
            onChange={event => this.setState({ lang: event.target.value })}
            className="flex-100"
          />
        </div>
        <div className="flex-100">
          <Editor html={body} onChange={updatedBody => this.setState({ body: updatedBody })} />
        </div>
        <div className="layout-row layout-align-space-between-center flex-100">
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

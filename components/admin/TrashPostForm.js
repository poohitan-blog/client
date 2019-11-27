import React from 'react';
import PropTypes from 'prop-types';
import Editor from '../../utils/editor';

class TrashPostForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = { ...props };

    this.submit = this.submit.bind(this);
  }

  async submit() {
    const { body } = this.state;

    if (!body) {
      // TODO: show error popup

      return;
    }

    const { onChange } = this.props;

    onChange(this.state);
  }

  render() {
    const { id } = this.props;
    const { body } = this.state;
    const title = id ? 'Редагувати запис' : 'Додати запис у смітник';

    return (
      <>
        <h1>{title}</h1>
        <div className="form">
          <Editor key={id} html={body} onChange={(value) => this.setState({ body: value })} />
          <div className="layout-row layout-align-end-center">
            <button type="submit" onClick={this.submit} className="flex-30">Вйо</button>
          </div>
        </div>
      </>
    );
  }
}

TrashPostForm.propTypes = {
  id: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

TrashPostForm.defaultProps = {
  id: '',
};

export default TrashPostForm;

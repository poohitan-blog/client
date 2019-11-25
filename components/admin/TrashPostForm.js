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
    if (!this.state.body) {
      // TODO: show error popup

      return;
    }

    this.props.onChange(this.state);
  }

  render() {
    const title = this.props.id ? 'Редагувати запис' : 'Додати запис у смітник';

    return (
      <div>
        <h1>{title}</h1>
        <div className="form">
          <Editor key={this.props.id} html={this.state.body} onChange={body => this.setState({ body })} />
          <div className="layout-row layout-align-end-center">
            <button onClick={this.submit} className="flex-30">Вйо</button>
          </div>
        </div>
      </div>
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

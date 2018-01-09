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
      <div className="children-equal-margin-vertical layout-row layout-wrap">
        <h1>{title}</h1>
        <div className="flex-100">
          <Editor key={this.props.id} html={this.state.body} onChange={body => this.setState({ body })} />
        </div>
        <div className="layout-row layout-align-center-center flex-100">
          <button onClick={this.submit} className="flex-30">Вйо</button>
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

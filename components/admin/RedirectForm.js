import React from 'react';
import PropTypes from 'prop-types';

import Checkbox from '../ui/Checkbox';

class RedirectForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = { ...props };

    this.change = this.change.bind(this);
  }

  change(params) {
    this.setState(params);
    this.props.onChange({ ...this.state, ...params });
  }

  render() {
    return (
      <div className="">
        <div className="layout-row layout-align-space-between-center">
          <input
            type="text"
            placeholder="Звідки"
            value={this.state.from}
            onChange={event => this.change({ from: event.target.value })}
            className="flex-100"
          />
          <span className="margin-left">&rarr;</span>
          <input
            type="text"
            placeholder="Куди"
            value={this.state.to}
            onChange={event => this.change({ to: event.target.value })}
            className="flex-100 margin-left"
          />
          <Checkbox
            label="Увімкн."
            checked={this.state.enabled}
            onChange={enabled => this.change({ enabled })}
            className="margin-left"
          />
          {
            Boolean(this.props.id) && <button onClick={this.props.onRemove} className="margin-left">Вид.</button>
          }
        </div>
      </div>
    );
  }
}

RedirectForm.propTypes = {
  id: PropTypes.string,
  from: PropTypes.string, // eslint-disable-line
  to: PropTypes.string, // eslint-disable-line
  enabled: PropTypes.bool, // eslint-disable-line
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func,
};

RedirectForm.defaultProps = {
  id: null,
  from: '',
  to: '',
  enabled: true,
  onRemove: () => {},
};

export default RedirectForm;

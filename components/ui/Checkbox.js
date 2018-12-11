import React from 'react';
import PropTypes from 'prop-types';
import CheckIcon from '../../static/icons/check.svg';

class Checkbox extends React.Component {
  constructor(props) {
    super(props);

    this.change = this.change.bind(this);
  }

  change(event) {
    this.props.onChange(event.target.checked);
  }

  render() {
    const { checked, label, className } = this.props;
    const checkboxId = `checkbox-${label}`;

    return (
      <div className={`checkbox ${className}`}>
        <label htmlFor={checkboxId} className="layout-row layout-align-start-center">
          <input id={checkboxId} type="checkbox" checked={checked} onChange={this.change} className="checkbox-native" />
          <div className="checkbox-square">
            {checked && <CheckIcon />}
          </div>
          <span className="checkbox-label">{label}</span>
        </label>
      </div>
    );
  }
}

Checkbox.propTypes = {
  checked: PropTypes.bool,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

Checkbox.defaultProps = {
  checked: false,
  className: '',
};

export default Checkbox;

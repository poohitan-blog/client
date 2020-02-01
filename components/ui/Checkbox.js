import React from 'react';
import PropTypes from 'prop-types';

import CheckIcon from '../../public/static/icons/check.svg';
import styles from '../../styles/components/ui/checkbox.scss';

class Checkbox extends React.Component {
  constructor(props) {
    super(props);

    this.change = this.change.bind(this);
  }

  change(event) {
    const { onChange } = this.props;

    onChange(event.target.checked);
  }

  render() {
    const { checked, label } = this.props;
    const checkboxId = `checkbox-${label}`;

    return (
      <div className={styles.wrapper}>
        <label htmlFor={checkboxId} className={styles.labelWrapper}>
          <input id={checkboxId} type="checkbox" checked={checked} onChange={this.change} className={styles.native} />
          <div className={styles.square}>
            {checked && <CheckIcon />}
          </div>
          <span className={styles.label}>{label}</span>
        </label>
      </div>
    );
  }
}

Checkbox.propTypes = {
  checked: PropTypes.bool,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

Checkbox.defaultProps = {
  checked: false,
};

export default Checkbox;

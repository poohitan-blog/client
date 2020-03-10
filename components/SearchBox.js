import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';

import SearchIcon from '../public/static/icons/search.svg';
import styles from '../styles/components/search-box.scss';

const PLACEHOLDER = 'бісовий пошук';
const ENTER_KEY_CODE = 13;

class SearchBox extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isFocused: false,
      query: props.query,
    };

    this.focus = this.focus.bind(this);
    this.blur = this.blur.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.setQuery = this.setQuery.bind(this);
  }

  setQuery(event) {
    const { value } = event.target;

    this.setState({
      query: value,
    });
  }

  handleKeyPress(event) {
    const { query } = this.state;

    if (!query.trim()) {
      return;
    }

    if (event.which === ENTER_KEY_CODE) {
      Router.push(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  }

  focus() {
    this.setState({
      isFocused: true,
    });
  }

  blur() {
    this.setState({
      isFocused: false,
    });
  }

  render() {
    const { query, isFocused } = this.state;
    const { className } = this.props;

    const classList = [styles.wrapper, className];

    if (isFocused) {
      classList.push(styles.focused);
    }

    return (
      <div className={classList.join(' ')}>
        <SearchIcon className={styles.icon} />
        <input
          type="text"
          value={query}
          placeholder={PLACEHOLDER}
          onFocus={this.focus}
          onBlur={this.blur}
          onKeyPress={this.handleKeyPress}
          onChange={this.setQuery}
          className={styles.input}
        />
      </div>
    );
  }
}

SearchBox.propTypes = {
  query: PropTypes.string,
  className: PropTypes.string,
};

SearchBox.defaultProps = {
  query: '',
  className: null,
};

export default SearchBox;

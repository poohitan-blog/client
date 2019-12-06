import React from 'react';
import Router from 'next/router';
import SearchIcon from '../public/static/icons/search.svg';

const PLACEHOLDER = 'бісовий пошук';
const ENTER_KEY_CODE = 13;

class SearchBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFocused: false,
      query: '',
    };

    this.focus = this.focus.bind(this);
    this.blur = this.blur.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.setQuery = this.setQuery.bind(this);
  }

  setQuery(event) {
    this.setState({
      query: event.target.value,
    });
  }

  handleKeyPress(event) {
    const { query } = this.state;

    if (event.which === ENTER_KEY_CODE) {
      Router.push(`/search?query=${encodeURIComponent(query)}`);
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
    const { isFocused } = this.state;

    return (
      <div className={`search-box ${isFocused ? 'search-box-focused' : ''} smaller layout-row layout-align-start-center`}>
        <SearchIcon className="search-box-icon" />
        <input
          type="text"
          placeholder={PLACEHOLDER}
          onFocus={this.focus}
          onBlur={this.blur}
          onKeyPress={this.handleKeyPress}
          onChange={this.setQuery}
          className="search-box-input"
        />
      </div>
    );
  }
}

export default SearchBox;

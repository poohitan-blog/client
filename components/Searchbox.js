import React from 'react';
import SearchIcon from '../static/icons/search.svg';

const PLACEHOLDER = 'пошук';

class Searchbox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFocused: false,
      placeholder: PLACEHOLDER
    };

    this.focus = this.focus.bind(this);
    this.blur = this.blur.bind(this);
  }

  focus() {
    this.setState({
      isFocused: true,
      placeholder: '',
    });
  }

  blur() {
    this.setState({
      isFocused: false,
      placeholder: PLACEHOLDER,
    });
  }

  render() {
    return (
      <div className={`search-box ${this.state.isFocused ? "search-box-focused" : ""} caption layout-row layout-align-start-center`}>
        <SearchIcon className="search-box-icon" />
        <input onFocus={this.focus} onBlur={this.blur} className="search-box-input" type="text" placeholder={this.state.placeholder} />
      </div>
    );
  }
}

export default Searchbox;

import React from 'react';
import SearchIcon from '../static/icons/search.svg';

const PLACEHOLDER = 'пошук';

class Searchbox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFocused: false,
    };

    this.focus = this.focus.bind(this);
    this.blur = this.blur.bind(this);
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
    return (
      <div className={`search-box ${this.state.isFocused ? 'search-box-focused' : ''} smaller layout-row layout-align-start-center`}>
        <SearchIcon className="search-box-icon" />
        <input
          onFocus={this.focus}
          onBlur={this.blur}
          className="search-box-input"
          type="text"
          placeholder={PLACEHOLDER}
        />
      </div>
    );
  }
}

export default Searchbox;

import React from 'react';
import TrashbinClosedIcon from "../../static/icons/trashbin.svg";
import TrashbinOpenIcon from "../../static/icons/trashbin-open.svg";

export default class Trashbin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
  }

  open() {
    this.setState({
      open: true
    });
  }

  close() {
    this.setState({
      open: false
    });
  }

  getTrashbinIcon() {
    return this.state.open ? <TrashbinOpenIcon/> : <TrashbinClosedIcon/>
  }

  render() {
    return <div className="header-trashbin" onMouseEnter={this.open} onMouseLeave={this.close}>
      {this.getTrashbinIcon()}
    </div>
  }
}

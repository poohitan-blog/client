import React from 'react';
import PropTypes from 'prop-types';

import API from '../../services/api';
import { getAllCookies } from '../../services/cookies';

import Dropzone from '../../components/Dropzone';

class UploadFilesForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      queue: [],
      links: [],
    };

    this.submit = this.submit.bind(this);
  }

  async submit() {
    this.setState({ loading: true });

    const newLinks = await API.upload(this.state.queue, getAllCookies());
    const updatedLinksList = [...this.state.links, ...newLinks];

    this.setState({
      links: updatedLinksList,
      queue: [],
      loading: false,
    });
  }

  render() {
    const links = !this.state.links.length ? null
      : <textarea className="upload-files-form-links-textarea margin-top flex-100" readOnly value={this.state.links.join('\n')} />;

    return (
      <div className="upload-files-form children-equal-margin-vertical layout-row layout-wrap">
        <h1>{this.props.title}</h1>
        <Dropzone
          loading={this.state.loading}
          files={this.state.queue}
          onDrop={files => this.setState({ queue: files })}
          className="upload-files-form-dropzone flex-100"
        />
        <div className="layout-row layout-align-end-center flex-100">
          <button onClick={() => this.submit()} className="flex-30">Вйо</button>
        </div>
        {links}
      </div>
    );
  }
}

UploadFilesForm.propTypes = {
  title: PropTypes.string,
};

UploadFilesForm.defaultProps = {
  title: '',
};

export default UploadFilesForm;

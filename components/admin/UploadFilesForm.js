import React from 'react';
import PropTypes from 'prop-types';

import API from '../../services/api';
import { getAllCookies } from '../../services/cookies';

import Dropzone from '../Dropzone';

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

    const { queue, links } = this.state;

    const newLinks = await API.upload(queue, getAllCookies());
    const updatedLinksList = [...links, ...newLinks];

    this.setState({
      links: updatedLinksList,
      queue: [],
      loading: false,
    });
  }

  render() {
    const { links, loading, queue } = this.state;
    const { title } = this.props;

    const linksMarkup = links.length
      ? <textarea className="upload-files-form-links-textarea" rows="10" readOnly value={links.join('\n')} />
      : null;

    return (
      <div>
        <h1>{title}</h1>
        <div className="form">
          <Dropzone
            loading={loading}
            files={queue}
            onDrop={(files) => this.setState({ queue: files })}
            className="upload-files-form-dropzone"
          />
          <div className="layout-row layout-align-end-center">
            <button type="submit" onClick={() => this.submit()} className="flex-30">Вйо</button>
          </div>
          {
            linksMarkup
          }
        </div>
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

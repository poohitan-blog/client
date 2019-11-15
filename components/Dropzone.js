import React from 'react';
import PropTypes from 'prop-types';
import ReactDropzone from 'react-dropzone';
import LoaderIcon from '../public/static/icons/three-dots.svg';

class Dropzone extends React.Component {
  constructor(props) {
    super(props);

    this.onDrop = this.onDrop.bind(this);
  }

  onDrop(files) {
    const currentFiles = this.props.files;
    const newFiles = files.filter(file => !currentFiles.some(currentFile =>
      file.name === currentFile.name && file.size === currentFile.size && file.type === currentFile.type));
    const updatedFilesList = [...currentFiles, ...newFiles];

    this.props.onDrop(updatedFilesList);
  }

  render() {
    const placeholderVisible = !this.props.files.length;
    const loaderVisible = this.props.loading;

    return (
      <ReactDropzone
        onDrop={this.onDrop}
        accept={this.props.accept}
        className={`dropzone ${this.props.className}`}
        activeClassName="dropzone-active"
        acceptClassName="dropzone-accept"
        rejectClassName="dropzone-reject"
        disablePreview
        disabled={this.props.loading}
      >
        <div className="dropzone-content">
          <div className={`dropzone-loader ${loaderVisible && 'visible'}`}>
            <LoaderIcon className="dropzone-loader-icon" />
          </div>
          <div className={`dropzone-placeholder ${placeholderVisible && 'visible'}`}>
            Кидай сюди шо-небудь
          </div>
          <div className="dropzone-filelist">{this.props.files.map(file => <div key={file.name}>{file.name}</div>)}</div>
        </div>
      </ReactDropzone>
    );
  }
}

Dropzone.propTypes = {
  files: PropTypes.arrayOf(PropTypes.object),
  onDrop: PropTypes.func.isRequired,
  accept: PropTypes.string,
  className: PropTypes.string,
  loading: PropTypes.bool,
};

Dropzone.defaultProps = {
  files: [],
  accept: null,
  className: '',
  loading: false,
};

export default Dropzone;

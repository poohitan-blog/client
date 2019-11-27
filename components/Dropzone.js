import React from 'react';
import PropTypes from 'prop-types';
import ReactDropzone from 'react-dropzone';
import LoaderIcon from '../public/static/icons/three-dots.svg';

class Dropzone extends React.Component {
  constructor(props) {
    super(props);

    this.onDrop = this.onDrop.bind(this);
  }

  onDrop(droppedFiles) {
    const { files: currentFiles, onDrop } = this.props;
    const newFiles = droppedFiles
      .filter((file) => !currentFiles
        .some((currentFile) => file.name === currentFile.name
          && file.size === currentFile.size
          && file.type === currentFile.type));
    const updatedFilesList = [...currentFiles, ...newFiles];

    onDrop(updatedFilesList);
  }

  render() {
    const {
      files,
      loading,
      accept,
      className,
    } = this.props;
    const placeholderVisible = !files.length;
    const loaderVisible = loading;

    return (
      <ReactDropzone
        onDrop={this.onDrop}
        accept={accept}
        className={`dropzone ${className}`}
        activeClassName="dropzone-active"
        acceptClassName="dropzone-accept"
        rejectClassName="dropzone-reject"
        disablePreview
        disabled={loading}
      >
        <div className="dropzone-content">
          <div className={`dropzone-loader ${loaderVisible && 'visible'}`}>
            <LoaderIcon className="dropzone-loader-icon" />
          </div>
          <div className={`dropzone-placeholder ${placeholderVisible && 'visible'}`}>
            Кидай сюди шо-небудь
          </div>
          <div className="dropzone-filelist">{files.map((file) => <div key={file.name}>{file.name}</div>)}</div>
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

import React from 'react';
import PropTypes from 'prop-types';
import ReactDropzone from 'react-dropzone';
import cc from 'classcat';

import { Circle } from 'components/ui/Loader';

import styles from 'styles/components/dropzone.module.scss';

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
        className={cc([styles.wrapper, className])}
        activeClassName={styles.active}
        acceptClassName={styles.accept}
        rejectClassName={styles.reject}
        disablePreview
        disabled={loading}
      >
        <div className={styles.content}>
          <div className={cc({ [styles.loader]: true, [styles.visible]: loaderVisible })}>
            <Circle className={styles.loaderIcon} />
          </div>
          <div className={cc({ [styles.placeholder]: true, [styles.visible]: placeholderVisible })}>
            Кидай сюди шо-небудь
          </div>
          <div className={styles.filelist}>{files.map((file) => <div key={file.name}>{file.name}</div>)}</div>
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
  className: null,
  loading: false,
};

export default Dropzone;

import React from 'react';
import PropTypes from 'prop-types';
import { parseCookies } from 'nookies';

import API from 'services/api';
import Dropzone from 'components/Dropzone';

import styles from 'styles/components/admin/upload-files-form.module.scss';

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

    const uploadResults = await API.upload(queue, parseCookies({}));
    const updatedLinksList = [...links, ...uploadResults.map((result) => result.url)];

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
      ? <textarea className={styles.linksTextarea} rows="10" readOnly value={links.join('\n')} />
      : null;

    return (
      <div>
        <h1>{title}</h1>
        <div className={styles.form}>
          <Dropzone
            loading={loading}
            files={queue}
            onDrop={(files) => this.setState({ queue: files })}
            className={styles.dropzone}
          />
          <div className={styles.footer}>
            <button type="submit" onClick={() => this.submit()} className={styles.submitButton}>Вйо</button>
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

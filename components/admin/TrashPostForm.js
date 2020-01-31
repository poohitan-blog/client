import React from 'react';
import PropTypes from 'prop-types';
import Editor from '../../utils/editor';

import styles from '../../styles/components/admin/trash-post-form.scss';

class TrashPostForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = { ...props };

    this.submit = this.submit.bind(this);
  }

  async submit() {
    const { body } = this.state;

    if (!body) {
      // TODO: show error popup

      return;
    }

    const { onChange } = this.props;

    onChange(this.state);
  }

  render() {
    const { id } = this.props;
    const { body } = this.state;
    const title = id ? 'Редагувати запис' : 'Додати запис у смітник';

    return (
      <>
        <h1>{title}</h1>
        <div className={styles.form}>
          <Editor key={id} html={body} onChange={(value) => this.setState({ body: value })} />
          <div className={styles.footer}>
            <button type="submit" onClick={this.submit} className={styles.submitButton}>Вйо</button>
          </div>
        </div>
      </>
    );
  }
}

TrashPostForm.propTypes = {
  id: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

TrashPostForm.defaultProps = {
  id: '',
};

export default TrashPostForm;

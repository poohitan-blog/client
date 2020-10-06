import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cc from 'classcat';

import { sendFeedback } from 'services/api';

import styles from 'styles/pages/feedback.module.scss';

const ENTER_KEY_CODE = 13;

const STATUS = {
  SENDING: 'Відправляється…',
  SENT: 'Відправлено',
};

class FeedBackPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      status: '',
      loading: false,
    };

    this.handleInput = this.handleInput.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.submit = this.submit.bind(this);
  }

  handleInput(event) {
    this.setState({
      text: event.target.value,
      status: '',
    });
  }

  handleKeyPress(event) {
    if (event.which === ENTER_KEY_CODE && !event.shiftKey) {
      event.preventDefault();

      this.submit();
    }
  }

  async submit() {
    const { text } = this.state;

    if (!text.trim()) {
      return;
    }

    this.setState({
      loading: true,
      status: STATUS.SENDING,
    });

    await sendFeedback(text);

    this.setState({
      loading: false,
      status: STATUS.SENT,
      text: '',
    });

    setTimeout(() => this.setState({ status: '' }), 3000);
  }

  render() {
    const { text, status, loading } = this.state;

    const classNameString = cc({
      [styles.wrapper]: true,
      [styles.loading]: loading,
    });

    return (
      <div className={classNameString}>
        <textarea
          rows="3"
          value={text}
          disabled={loading}
          onInput={this.handleInput}
          onChange={this.handleInput}
          onKeyPress={this.handleKeyPress}
          className={styles.textarea}
        />
        <div className={styles.footer}>
          <div className={styles.status}>{status}</div>
          <div className={styles.send} title="Шоб надіслати, натисни Enter або клацни на літачок">
            <span className={styles.buttonCaption}>Enter або</span>
            <FontAwesomeIcon
              icon="paper-plane"
              title="Надіслати"
              onClick={this.submit}
              className={styles.button}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default FeedBackPage;

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cc from 'classcat';

import { sendFeedback } from 'services/api';

import styles from 'styles/pages/feedback.module.scss';

const ENTER_KEY_CODE = 13;

const STATUS = {
  SENDING: 'Відправляється…',
  SENT: 'Відправлено',
};

function FeedBackPage() {
  const [text, setText] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const classNameString = cc({
    [styles.wrapper]: true,
    [styles.loading]: loading,
  });

  async function submit() {
    if (!text.trim()) {
      return;
    }

    setLoading(true);
    setStatus(STATUS.SENDING);

    await sendFeedback(text);

    setLoading(false);
    setStatus(STATUS.SENT);
    setText('');

    setTimeout(() => setStatus(''), 3000);
  }

  function handleInput(event) {
    setText(event.target.value);
    setStatus('');
  }

  function handleKeyPress(event) {
    if (event.which === ENTER_KEY_CODE && !event.shiftKey) {
      event.preventDefault();

      submit();
    }
  }

  return (
    <div className={classNameString}>
      <textarea
        rows="3"
        value={text}
        disabled={loading}
        onInput={handleInput}
        onChange={handleInput}
        onKeyPress={handleKeyPress}
        className={styles.textarea}
      />
      <div className={styles.footer}>
        <div className={styles.status}>{status}</div>
        <div className={styles.send} title="Шоб надіслати, натисни Enter або клацни на літачок">
          <span className={styles.buttonCaption}>Enter або</span>
          <FontAwesomeIcon
            icon="paper-plane"
            title="Надіслати"
            onClick={submit}
            className={styles.button}
          />
        </div>
      </div>
    </div>
  );
}

export default FeedBackPage;

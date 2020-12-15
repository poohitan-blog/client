import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  format,
  parse,
  getHours,
  getMinutes,
  getSeconds,
  setHours,
  setMinutes,
  setSeconds,
  isValid,
} from 'date-fns';
import { uk } from 'date-fns/locale';

import styles from 'styles/components/moment.module.scss';

const Footer = ({
  caption, date, isEditable, onChange,
}) => {
  const [dateString, setDateString] = useState(format(new Date(date), 'dd-MM-yyyy'));
  const [currentCaption, setCaption] = useState(caption);

  if (!isEditable) {
    const dateText = format(new Date(date), 'LLLL yyyy', { locale: uk });

    return (
      <div className={styles.footer}>
        <span className={styles.caption}>{caption}</span>
        <span className={styles.date}>{dateText}</span>
      </div>
    );
  }

  return (
    <div className={styles.footer}>
      <input
        type="text"
        value={currentCaption || ''}
        placeholder="Опис моменту"
        onChange={(event) => setCaption(event.target.value)}
        onBlur={() => onChange({ caption: currentCaption })}
        className={styles.captionInput}
      />
      <input
        type="text"
        value={dateString}
        onChange={(event) => setDateString(event.target.value)}
        onBlur={() => {
          const now = new Date();
          const newDate = setHours(
            setMinutes(
              setSeconds(
                parse(dateString, 'dd-MM-yyyy', new Date()), getSeconds(now),
              ), getMinutes(now),
            ), getHours(now),
          );

          if (!isValid(newDate)) {
            return;
          }

          onChange({ capturedAt: newDate });
        }}
        className={styles.dateInput}
      />
    </div>
  );
};

Footer.propTypes = {
  caption: PropTypes.string,
  date: PropTypes.instanceOf(Date).isRequired,
  isEditable: PropTypes.bool,
  onChange: PropTypes.func,
};

Footer.defaultProps = {
  caption: '',
  isEditable: false,
  onChange: () => {},
};

export default Footer;

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cc from 'classcat';

import HEXToRGB from 'helpers/hex-to-rgb';

import Footer from 'components/moment/Footer';
import styles from 'styles/components/moment.module.scss';

const THUMBNAIL_WIDTH = 700;
const FULLSCREEN_WIDTH = 1920;

const Moment = ({
  url,
  width,
  height,
  averageColor,
  caption,
  capturedAt,
  isEditable,
  isOpen,
  onChange,
  onRemove,
  className,
}) => {
  const aspectRatio = width / height;
  const paddingTop = 100 / aspectRatio;
  const thumbnailUrl = `${url}?width=${THUMBNAIL_WIDTH}`;
  const averageColorRGB = HEXToRGB(averageColor);

  const [isCurrentlyOpen, setIsOpen] = useState(isOpen);
  const [isDeleted, setIsDeleted] = useState(false);

  const enterFullScreen = (event) => {
    event.preventDefault();

    setIsOpen(true);
  };

  const exitFullScreen = (event) => {
    event.preventDefault();

    setIsOpen(false);
  };

  const remove = async () => {
    await onRemove();

    setIsDeleted(true);
  };

  const wrapperClassName = cc({
    [styles.wrapper]: true,
    [styles.deleted]: isDeleted,
    [className]: Boolean(className),
  });

  const fullScreenWrapperClassName = cc({
    [styles.fullScreenWrapper]: true,
    [styles.fullScreenWrapperOpen]: isCurrentlyOpen,
  });

  return (
    <div className={wrapperClassName}>
      <div className={styles.container}>
        <a
          href={url}
          onClick={enterFullScreen}
        >
          <div
            className={styles.image}
            style={{
              backgroundColor: `#${averageColor}`,
              backgroundImage: `url('${thumbnailUrl}')`,
              paddingTop: `${paddingTop}%`,
            }}
          />
        </a>
        <Footer
          caption={caption}
          date={capturedAt}
          isEditable={isEditable}
          onChange={onChange}
        />

        <div className={styles.removeButton} onClick={remove}>
          <a><FontAwesomeIcon icon="times" /></a>
        </div>
      </div>

      <div
        className={fullScreenWrapperClassName}
        style={{ backgroundColor: `rgba(${averageColorRGB.join(', ')}, 0.7)` }}
        onClick={exitFullScreen}
      >
        <img src={`${url}?width=${FULLSCREEN_WIDTH}`} className={styles.fullScreenImage} alt={caption} />
      </div>
    </div>
  );
};

Moment.propTypes = {
  url: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  averageColor: PropTypes.string,
  caption: PropTypes.string,
  capturedAt: PropTypes.instanceOf(Date).isRequired,
  isEditable: PropTypes.bool,
  isOpen: PropTypes.bool,
  onChange: PropTypes.func,
  onRemove: PropTypes.func,
  className: PropTypes.string,
};

Moment.defaultProps = {
  averageColor: 'FFFFFF',
  caption: '',
  isEditable: false,
  isOpen: false,
  onChange: () => {},
  onRemove: () => {},
  className: '',
};

export default Moment;

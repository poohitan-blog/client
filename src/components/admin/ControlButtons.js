import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Router from 'next/router';
import pluralize from 'pluralize';
import { parseCookies } from 'nookies';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cc from 'classcat';

import Popup from 'components/Popup';
import API from 'services/api';

import styles from 'styles/components/admin/control-buttons.module.scss';

const editLinkGenerators = {
  page: (slug) => `/pages/${slug}/edit`,
  post: (slug) => `/posts/${slug}/edit`,
  postTranslation: (post, language) => `/posts/${post}/translations/${language}/edit`,
  trashPost: (id) => `/trash/${id}/edit`,
};

const entityTypeNames = {
  post: 'запис',
  postTranslation: 'переклад',
  page: 'сторінку',
  trashPost: 'запис',
};

async function removeEntity(entityType, tokens) {
  await API[pluralize(entityType)].remove(...tokens, parseCookies({}));

  if (entityType === 'trashPost') {
    return Router.push('/trash');
  }

  return Router.push('/');
}

const ControlButtons = (props) => {
  const {
    entityType,
    tokens,
    className,
    id,
  } = props;

  const [removePopupVisible, setRemovePopupVisible] = useState(false);
  const hidePopup = () => setRemovePopupVisible(false);
  const showPopup = () => setRemovePopupVisible(true);

  const entityTypeName = entityTypeNames[entityType];
  const editLink = editLinkGenerators[entityType](...tokens);

  return (
    <span className={cc([styles.wrapper, className])} id={id}>
      <div className={cc([styles.button, styles.buttonEdit])}>
        <Link href={editLink}>
          <a><FontAwesomeIcon icon="edit" /></a>
        </Link>
      </div>

      <div className={styles.button} onClick={showPopup}>
        <a><FontAwesomeIcon icon="times" /></a>
      </div>

      <Popup visible={removePopupVisible} onClose={hidePopup}>
        <h1>{`Видалити ${entityTypeName}?`}</h1>
        <p>Якшо шо, можна буде відновити з бази.</p>
        <div className={styles.popupButtonsWrapper}>
          <button type="button" onClick={hidePopup}>
            Не треба
          </button>
          <button type="button" onClick={() => removeEntity(entityType, tokens)}>
            Видалити
          </button>
        </div>
      </Popup>
    </span>
  );
};

ControlButtons.propTypes = {
  tokens: PropTypes.arrayOf(PropTypes.string).isRequired,
  entityType: PropTypes.string.isRequired,
  className: PropTypes.string,
  id: PropTypes.string,
};

ControlButtons.defaultProps = {
  className: null,
  id: null,
};

export default ControlButtons;

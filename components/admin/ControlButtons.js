import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Router from 'next/router';
import pluralize from 'pluralize';

import Popup from '../Popup';
import API from '../../services/api';
import { getAllCookies } from '../../services/cookies';

import EditIcon from '../../public/static/icons/edit.svg';
import RemoveIcon from '../../public/static/icons/remove.svg';
import styles from '../../styles/components/admin/control-buttons.scss';

const linkGenerators = {
  page: {
    href: () => '/pages/[slug]/edit',
    as: (path) => `/pages/${path}/edit`,
  },
  post: {
    href: () => '/posts/[slug]/edit',
    as: (path) => `/posts/${path}/edit`,
  },
  postTranslation: {
    href: () => '/posts/[slug]/translations/[language]/edit',
    as: (post, language) => `/posts/${post}/translations/${language}/edit`,
  },
  trashPost: {
    href: () => '/trash/[id]/edit',
    as: (id) => `/trash/${id}/edit`,
  },
};

class ControlButtons extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      removePopupVisible: false,
    };

    this.showRemovePopup = this.showRemovePopup.bind(this);
    this.hideRemovePopup = this.hideRemovePopup.bind(this);
    this.remove = this.remove.bind(this);
  }

  showRemovePopup() {
    this.setState({ removePopupVisible: true });
  }

  hideRemovePopup() {
    this.setState({ removePopupVisible: false });
  }

  async remove() {
    const { attachedTo, tokens } = this.props;

    await API[pluralize(attachedTo)].remove(...tokens, getAllCookies());
    this.hideRemovePopup();

    if (attachedTo === 'trashPost') {
      return Router.push('/trash');
    }

    return Router.push('/');
  }

  renderPopupContent() {
    const { attachedTo } = this.props;
    const contentTypes = {
      post: 'запис',
      postTranslation: 'переклад',
      page: 'сторінку',
      trashPost: 'запис',
    };

    return (
      <>
        <h1>{`Видалити ${contentTypes[attachedTo]}?`}</h1>
        <p>Якшо шо, можна буде відновити з бази.</p>
        <div className={styles.popupButtonsWrapper}>
          <button type="button" onClick={this.hideRemovePopup}>
            Не треба
          </button>
          <button type="button" onClick={this.remove}>
            Видалити
          </button>
        </div>
      </>
    );
  }

  render() {
    const {
      attachedTo,
      tokens,
      className,
      id,
    } = this.props;
    const { removePopupVisible } = this.state;

    const linkGenerator = linkGenerators[attachedTo];
    const href = linkGenerator.href(...tokens);
    const as = linkGenerator.as(...tokens);

    const popupContent = this.renderPopupContent();

    return (
      <span className={`${styles.wrapper} ${className}`} id={id}>
        <div className={styles.button}>
          <Link as={as} href={href}>
            <a><EditIcon /></a>
          </Link>
        </div>
        <div className={styles.button} onClick={this.showRemovePopup}>
          <RemoveIcon />
        </div>
        <Popup visible={removePopupVisible} onClose={this.hideRemovePopup}>
          {popupContent}
        </Popup>
      </span>
    );
  }
}

ControlButtons.propTypes = {
  tokens: PropTypes.arrayOf(PropTypes.string).isRequired,
  attachedTo: PropTypes.string.isRequired,
  className: PropTypes.string,
  id: PropTypes.string,
};

ControlButtons.defaultProps = {
  className: null,
  id: null,
};

export default ControlButtons;

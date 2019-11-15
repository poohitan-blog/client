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

const linkGenerators = {
  page: {
    href: path => `/admin/edit-page?path=${path}`,
    as: path => `/${path}/edit`,
  },
  post: {
    href: path => `/admin/edit-post?path=${path}`,
    as: path => `/p/${path}/edit`,
  },
  postTranslation: {
    href: (post, language) => `/admin/edit-post-translation?post=${post}&language=${language}`,
    as: (post, language) => `/p/${post}/translations/${language}/edit`,
  },
  trashPost: {
    href: id => `/admin/edit-trash-post?id=${id}`,
    as: id => `/trash/${id}/edit`,
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
      <div>
        <h1>Видалити {contentTypes[attachedTo]}?</h1>
        <p>Якшо шо, можна буде відновити з бази.</p>
        <div className="layout-row">
          <button onClick={this.hideRemovePopup} className="flex-50">
            Не треба
          </button>
          <button onClick={this.remove} className="flex-50 flex-offset-5">
            Видалити
          </button>
        </div>
      </div>
    );
  }

  render() {
    const { attachedTo, tokens } = this.props;
    const linkGenerator = linkGenerators[attachedTo];
    const href = linkGenerator.href(...tokens);
    const as = linkGenerator.as(...tokens);

    const popupContent = this.renderPopupContent();

    return (
      <span className="admin-control-buttons layout-row layout-align-start-center">
        <div className="admin-control-button">
          <Link as={as} href={href}>
            <a><EditIcon /></a>
          </Link>
        </div>
        <div className="admin-control-button" onClick={this.showRemovePopup}>
          <RemoveIcon />
        </div>
        <Popup visible={this.state.removePopupVisible} onClose={() => this.setState({ removePopupVisible: false })}>
          {popupContent}
        </Popup>
      </span>
    );
  }
}

ControlButtons.propTypes = {
  tokens: PropTypes.arrayOf(PropTypes.string).isRequired,
  attachedTo: PropTypes.string.isRequired,
};

export default ControlButtons;

import React from 'react';
import PropTypes from 'prop-types';
import HTMLReactParser from 'html-react-parser';

import AdminControlButtons from './admin/ControlButtons';
import { Context as SessionContext } from '../services/session';

import HiddenIcon from '../public/static/icons/hidden.svg';
import styles from '../styles/components/page.scss';

const Page = (props) => {
  const {
    title,
    path,
    body,
    private: hidden,
  } = props;

  return (
    <article className={styles.wrapper} id="page">
      <h1 className={styles.title} id="page-title">
        {title}
        <SessionContext.Consumer>
          {({ isAuthenticated }) => isAuthenticated && (
            <AdminControlButtons
              attachedTo="page"
              tokens={[path]}
              className={styles.adminControlButtons}
              id="page-admin-control-buttons"
            />
          )}
        </SessionContext.Consumer>
        {
          hidden && <div className={styles.titleIcon} id="page-title-icon"><HiddenIcon /></div>
        }
      </h1>
      <div className={styles.body} id="page-body">
        {
          HTMLReactParser(body)
        }
      </div>
    </article>
  );
};

Page.propTypes = {
  title: PropTypes.string,
  body: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  private: PropTypes.bool,
};

Page.defaultProps = {
  title: '',
  private: false,
};

export default Page;

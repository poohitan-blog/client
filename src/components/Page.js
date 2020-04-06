import React from 'react';
import PropTypes from 'prop-types';
import parse from 'html-react-parser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import AdminControlButtons from 'Components/admin/ControlButtons';
import { Context as SessionContext } from 'Services/session';
import HTMLProcessor from 'Utils/html-processor';

import styles from 'Styles/components/page.module.scss';

const Page = (props) => {
  const {
    title,
    slug,
    body,
    hidden,
  } = props;

  return (
    <article className={styles.wrapper} id="page">
      <h1 className={styles.title} id="page-title">
        <span>{title}</span>
        <div className={styles.titleIcons}>
          {
            hidden && (
              <FontAwesomeIcon icon="eye-slash" className={styles.titleIcon} id="page-title-icon" />
            )
          }
          <SessionContext.Consumer>
            {({ isAuthenticated }) => isAuthenticated && (
              <AdminControlButtons
                attachedTo="page"
                tokens={[slug]}
                className={styles.adminControlButtons}
                id="page-admin-control-buttons"
              />
            )}
          </SessionContext.Consumer>
        </div>
      </h1>
      <div className={styles.body} id="page-body">
        {
          parse(body, {
            replace(node) {
              return new HTMLProcessor(node)
                .asImage()
                .asLink()
                .asCode()
                .asIframe()
                .getNode();
            },
          })
        }
      </div>
    </article>
  );
};

Page.propTypes = {
  title: PropTypes.string,
  body: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  hidden: PropTypes.bool,
};

Page.defaultProps = {
  title: '',
  hidden: false,
};

export default Page;
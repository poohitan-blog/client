import React from 'react';
import PropTypes from 'prop-types';
import parse from 'html-react-parser';
import { useSession } from 'next-auth/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import AdminControlButtons from 'components/admin/ControlButtons';
import HTMLProcessor from 'utils/html-processor';

import styles from 'styles/components/page.module.scss';

const Page = (props) => {
  const {
    title,
    slug,
    body,
    hidden,
  } = props;

  const [session] = useSession();

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
          {
            session && (
              <AdminControlButtons
                entityType="page"
                tokens={[slug]}
                className={styles.adminControlButtons}
                id="page-admin-control-buttons"
              />
            )
          }
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
                .asMath()
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

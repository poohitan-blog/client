import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/router';

import API from 'services/api';

import styles from 'styles/components/trash/header.module.scss';

const Header = () => {
  const router = useRouter();

  const navigateToRandomPost = async () => {
    try {
      const post = await API.trashPosts.findRandom();

      router.push(`/trash/${post.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <h1 className={styles.wrapper}>
      <span>Смітник</span>
      <div onClick={navigateToRandomPost}>
        <a title="Випадковий запис">
          <FontAwesomeIcon icon="dove" className={styles.icon} />
        </a>
      </div>
    </h1>
  );
};

export default React.memo(Header);

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import { NextSeo } from 'next-seo';
import { parseCookies } from 'nookies';
import { Masonry, useInfiniteLoader } from 'masonic';

import withSession from 'hocs/withSession';

import Dropzone from 'components/Dropzone';
import { Context as SessionContext } from 'services/session';
import API from 'services/api';
import createMomentMasonryCard from 'utils/create-moment-masonry-card';

import styles from 'styles/pages/moments.module.scss';

const MOMENTS_PER_PAGE = 15;

const MomentsPage = ({ moments, totalPages }) => {
  const pageTitle = 'Моменти';

  const [items, setItems] = useState(moments);
  const [hasMore, setHasMore] = useState(totalPages > 1);
  const [isUploading, setIsUploading] = useState(false);

  const createMoments = async (files) => {
    setIsUploading(true);

    const uploadedImages = await API.upload(files, parseCookies({}), { analyze: true });

    await API.moments.create(uploadedImages.map((image) => {
      const {
        originalWidth,
        originalHeight,
        averageColor,
      } = image.metadata || {};

      return {
        url: image.url,
        width: originalWidth,
        height: originalHeight,
        averageColor,
      };
    }));

    Router.reload();
  };

  const updateMoment = async (id, body) => {
    await API.moments.update(id, body, parseCookies({}));
  };

  const removeMoment = async (id) => {
    await API.moments.remove(id, parseCookies({}));
  };

  const fetchMoreItems = async (startIndex, stopIndex, currentItems) => {
    if (!hasMore) {
      return;
    }

    setHasMore(false);

    const currentPage = Math.floor(startIndex / MOMENTS_PER_PAGE);
    const nextPage = currentPage + 1;

    const { docs } = await API.moments.find({
      limit: MOMENTS_PER_PAGE,
      page: nextPage,
    });

    setHasMore(currentPage + 1 < totalPages);
    setItems([...currentItems, ...docs]);
  };

  const maybeLoadMore = useInfiniteLoader(fetchMoreItems, {
    isItemLoaded: (index, list) => Boolean(list[index]),
  });

  const MomentMasonryCard = createMomentMasonryCard({
    className: styles.moment,
    onChange: updateMoment,
    onRemove: removeMoment,
  });

  return (
    <>
      <NextSeo title={pageTitle} />
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h1 className={styles.title}>{pageTitle}</h1>
        </div>
        <SessionContext.Consumer>
          {
            ({ isAuthenticated }) => {
              if (!isAuthenticated) {
                return null;
              }

              return (
                <div className={styles.moment} key="dropzone">
                  <Dropzone loading={isUploading} onDrop={createMoments} />
                </div>
              );
            }
          }
        </SessionContext.Consumer>
        <Masonry
          items={items}
          render={MomentMasonryCard}
          columnWidth={400}
          onRender={maybeLoadMore}
          className={styles.grid}
        />
      </div>
    </>
  );
};

MomentsPage.getInitialProps = async ({ query }) => {
  const { page = 1 } = query;

  const { docs, meta } = await API.moments.find({
    limit: MOMENTS_PER_PAGE,
    page,
  });

  const { totalPages } = meta;

  return {
    moments: docs,
    totalPages,
  };
};

MomentsPage.propTypes = {
  moments: PropTypes.arrayOf(PropTypes.object).isRequired,
  totalPages: PropTypes.number.isRequired,
};

export default withSession(MomentsPage);

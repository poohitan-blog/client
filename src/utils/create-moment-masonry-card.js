import React from 'react';
import PropTypes from 'prop-types';
import { useSession } from 'next-auth/client';

import Moment from 'components/Moment';

function createMomentMasonryCard({ onChange, onRemove, className }) {
  const MasonryCard = ({ data }) => {
    const {
      id,
      url,
      caption,
      width,
      height,
      averageColor,
      capturedAt,
    } = data;

    const [session] = useSession();

    return (
      <Moment
        id={id}
        url={url}
        caption={caption}
        width={width}
        height={height}
        averageColor={averageColor}
        capturedAt={new Date(capturedAt)}
        isEditable={Boolean(session)}
        onChange={(updatedMoment) => onChange(id, updatedMoment)}
        onRemove={() => onRemove(id)}
        className={className}
      />
    );
  };

  MasonryCard.propTypes = {
    data: PropTypes.shape({
      id: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      caption: PropTypes.string,
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
      capturedAt: PropTypes.string.isRequired,
      averageColor: PropTypes.string,
    }).isRequired,
  };

  return MasonryCard;
}

export default createMomentMasonryCard;

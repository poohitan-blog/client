import React from 'react';
import PropTypes from 'prop-types';

import Moment from 'components/Moment';
import { Context as SessionContext } from 'services/session';

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

    return (
      <SessionContext.Consumer>
        {
          ({ isAuthenticated }) => (
            <Moment
              id={id}
              url={url}
              caption={caption}
              width={width}
              height={height}
              averageColor={averageColor}
              capturedAt={new Date(capturedAt)}
              isEditable={isAuthenticated}
              onChange={(updatedMoment) => onChange(id, updatedMoment)}
              onRemove={() => onRemove(id)}
              className={className}
            />
          )
        }
      </SessionContext.Consumer>
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

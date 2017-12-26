import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import moment from 'moment';

const TrashPost = (props) => {
  const markup = { __html: props.body };
  const formattedDate = moment(props.createdAt).format('DD:MM:YYYY, HH:mm');

  return (
    <div className="trash-post">
      <div dangerouslySetInnerHTML={markup} />
      <div className="trash-post-footer caption layout-row layout-align-space-between-center">
        <span className="nowrap">
          <Link as={`/trash/${props.id}`} href={`/trash?id=${props.id}`}><a>постійне посилання</a></Link>
        </span>
        <hr className="trash-post-footer-line flex-100" />
        <span className="nowrap">{ formattedDate }</span>
      </div>
    </div>
  );
};

TrashPost.propTypes = {
  id: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  createdAt: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ]).isRequired,
};

export default TrashPost;

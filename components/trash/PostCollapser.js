import React from 'react';
import PropTypes from 'prop-types';
import AngleIcon from '../../static/icons/angle-down.svg';

const PostCollapser = ({ isPostCollapsed, onClick }) => {
  const text = isPostCollapsed ? 'Розгорнути' : 'Згорнути';
  const iconClass = isPostCollapsed ? 'trash-post-collapser-icon-collapsed' : '';

  return (
    <div className="trash-post-collapser layout-row layout-align-center-center" title={text} onClick={onClick}>
      <div className={`trash-post-collapser-icon ${iconClass}`}><AngleIcon /></div>
      <div className="trash-post-collapser-text">{text}</div>
      <div className={`trash-post-collapser-icon ${iconClass}`}><AngleIcon /></div>
    </div>
  );
};

PostCollapser.propTypes = {
  isPostCollapsed: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default PostCollapser;

import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import EditIcon from '../../static/icons/edit.svg';
import RemoveIcon from '../../static/icons/remove.svg';

const linkGenerators = {
  page: {
    href: path => `/admin/page-editor?path=${path}`,
    as: path => `/${path}/edit`,
  },
  post: {
    href: path => `/admin/post-editor?path=${path}`,
    as: path => `/p/${path}/edit`,
  },
  trashPost: {
    href: id => `/admin/trash-post-editor?id=${id}`,
    as: id => `/trash/${id}/edit`,
  },
};

const ControlButtons = (props) => {
  const { attachedTo, path, id } = props;
  const linkGenerator = linkGenerators[attachedTo];
  const href = linkGenerator.href(path || id);
  const as = linkGenerator.as(path || id);

  return (
    <span className="admin-control-buttons layout-row layout-align-start-center">
      <div className="admin-control-button">
        <Link as={as} href={href} prefetch>
          <a><EditIcon /></a>
        </Link>
      </div>
      <div className="admin-control-button">
        <RemoveIcon />
      </div>
    </span>
  );
};

ControlButtons.propTypes = {
  path: PropTypes.string,
  id: PropTypes.string,
  attachedTo: PropTypes.string.isRequired,
};

ControlButtons.defaultProps = {
  path: '',
  id: '',
};

export default ControlButtons;

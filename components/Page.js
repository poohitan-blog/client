import React from 'react';
import PropTypes from 'prop-types';
import HTMLReactParser from 'html-react-parser';
import AdminControlButtons from './admin/ControlButtons';
import HiddenIcon from '../public/static/icons/hidden.svg';

const Page = (props, context) => {
  const {
    title,
    path,
    body,
    private: hidden,
  } = props;
  const { isAuthenticated } = context;

  return (
    <article className="page">
      <h1 className="layout-row layout-align-start-start">
        {title}
        {
          isAuthenticated
          && <AdminControlButtons attachedTo="page" tokens={[path]} className="page-admin-control-buttons" />
        }
        {
          hidden && <div className="page-title-icon"><HiddenIcon /></div>
        }
      </h1>
      <div className="page-body">{HTMLReactParser(body)}</div>
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

Page.contextTypes = {
  isAuthenticated: PropTypes.bool,
};

export default Page;

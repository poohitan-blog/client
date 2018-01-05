import React from 'react';
import PropTypes from 'prop-types';
import AdminControlButtons from './admin/ControlButtons';
import HiddenIcon from '../static/icons/hidden.svg';

const Page = (props, context) => (
  <article className="page">
    <h1 className="layout-row layout-align-start-start">
      {props.title}
      {
        context.isAuthenticated &&
        <div className="page-admin-control-buttons"><AdminControlButtons attachedTo="page" path={props.path} /></div>
      }
      {
        props.private && <div className="page-title-icon"><HiddenIcon /></div>
      }
    </h1>
    <div dangerouslySetInnerHTML={{ __html: props.body }} />
  </article>
);

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

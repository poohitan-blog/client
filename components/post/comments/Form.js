import React from 'react';
import PropTypes from 'prop-types';
import { LazyLoadComponent } from 'react-lazy-load-image-component';

import Disqus from './Disqus';

import LoaderIcon from '../../../public/static/icons/three-dots.svg';
import styles from '../../../styles/components/post/comment-form.scss';

class CommentForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };

    this.hideLoader = this.hideLoader.bind(this);
  }

  hideLoader() {
    this.setState({
      loading: false,
    });
  }

  render() {
    const { title, slug } = this.props;
    const { loading } = this.state;

    return (
      <div id="comments" className={styles.wrapper}>
        <div className={`${styles.formWrapper} ${loading ? styles.loading : ''}`}>
          <div className={styles.loader}>
            <b className={styles.encouragement}>Напиши коментар, трясця</b>
            <LoaderIcon className={styles.loaderAnimation} />
          </div>
          <LazyLoadComponent threshold={300}>
            <Disqus
              title={title}
              identifier={slug}
              onReady={this.hideLoader}
            />
          </LazyLoadComponent>
        </div>
      </div>
    );
  }
}

CommentForm.propTypes = {
  title: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
};

export default CommentForm;

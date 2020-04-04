import React from 'react';
import PropTypes from 'prop-types';
import { LazyLoadComponent } from 'react-lazy-load-image-component';

import Disqus from './Disqus';
import { Circle } from '../../ui/Loader';

import styles from '../../../styles/components/post/comment-form.module.scss';

const ACCEPTABLE_WAITING_TIME = 5000;

class CommentForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      loadingFailed: false,
    };

    this.setFailTimeout = this.setFailTimeout.bind(this);
    this.hideLoader = this.hideLoader.bind(this);
  }

  setFailTimeout() {
    const timeout = setTimeout(() => {
      this.setState({ loadingFailed: true });
    }, ACCEPTABLE_WAITING_TIME);

    this.setState({
      timeout,
    });
  }

  hideLoader() {
    const { timeout } = this.state;

    clearTimeout(timeout);

    this.setState({
      loading: false,
    });
  }

  render() {
    const { title, slug } = this.props;
    const { loading, loadingFailed } = this.state;

    return (
      <div id="comments" className={styles.wrapper}>
        <div className={`${styles.formWrapper} ${loading ? styles.loading : ''}`}>
          <div className={styles.loader}>
            {
              loadingFailed
                ? (
                  <>
                    <span>Коментарі шось дуже довго вантажаться.</span>
                    <br />
                    <span>Почекай ше трохи, або спробуй оновити сторінку.</span>
                    <br />
                    <span>Якшо не допоможе, то це дуже сумно.</span>
                  </>
                )
                : (
                  <>
                    <span>Напиши коментар, трясця</span>
                    <Circle className={styles.loaderAnimation} />
                  </>
                )
            }
          </div>
          <LazyLoadComponent beforeLoad={this.setFailTimeout} threshold={300}>
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

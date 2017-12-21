import * as Grammar from '../../services/grammar';

export default (props) => {
  return <div className="post-footer layout-row">
      <div className="post-footer-comments">{Grammar.describeCommentsCount(props.commentsCount)}</div>
      <div className="post-footer-date"></div>
      <div className="post-footer-tags"></div>
      <div className="post-footer-social"></div>
    </div>
}

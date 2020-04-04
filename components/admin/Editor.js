// Warning: this component can be used client-side only
// Import it using dynamic import with "ssr: false"

import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import { current } from '../../config';

import '../../public/static/libs/froala/froala_editor.pkgd.min';
import '../../public/static/libs/froala/plugins/image.min';
import '../../public/static/libs/froala/languages/uk';

import './editor/buttons/cut';
import './editor/buttons/quote';

import styles from '../../styles/components/admin/editor.module.scss';

const buttons = [
  'bold', 'italic', 'underline', 'strikeThrough',
  '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL',
  '|', 'subscript', 'superscript',
  '|', 'color', 'clearFormatting',
  '-', 'insertLink',
  '|', 'insertImage', 'insertVideo', 'insertFile',
  '|', 'custom-quote', 'insertTable', 'insertHR',
  '|', 'cut',
  '-', 'fullscreen', 'html',
];

const EDITOR_CLASSNAME = 'js-editor';

class Editor extends React.Component {
  componentDidMount() {
    this.init();
  }

  componentWillUnmount() {
    const $editor = $(`.${EDITOR_CLASSNAME}`);

    $editor.froalaEditor('destroy');
  }

  init() {
    const $editor = $(`.${EDITOR_CLASSNAME}`);

    $editor.froalaEditor({
      charCounterCount: false,
      height: 350,
      heightMax: 350,

      fileMaxSize: 15 * 1024 * 1024,
      fileUploadMethod: 'POST',
      fileUploadParam: 'files',
      fileUploadURL: `${current.apiURL}/files/froala`,

      htmlAllowedEmptyTags: ['iframe', 'object', 'video', 'cut', 'pre', 'code'],
      htmlAllowedTags: ['a', 'abbr', 'address', 'audio', 'b', 'blockquote', 'br', 'cite', 'code', 'cut', 'div', 'em', 'embed', 'figcaption', 'figure', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'i', 'iframe', 'img', 'li', 'link', 'object', 'ol', 'p', 'pre', 's', 'span', 'small', 'source', 'strike', 'strong', 'sub', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'u', 'ul', 'video'],
      htmlDoNotWrapTags: ['br', 'blockquote', 'code', 'pre', 'hr', 'iframe'],
      htmlExecuteScripts: false,
      htmlUntouched: true,

      imageAllowedTypes: ['jpeg', 'jpg', 'png', 'gif'],
      imageDefaultWidth: 0,
      imageEditButtons: ['imageReplace', 'imageRemove', 'imageSize', '-', '|', 'imageLink', 'linkOpen', 'linkEdit', 'linkRemove', 'imageAlt', 'imageAlign'],
      imageMaxSize: 15 * 1024 * 1024,
      imagePasteProcess: true,
      imageUploadMethod: 'POST',
      imageUploadParam: 'images',
      imageUploadURL: `${current.apiURL}/images/froala`,

      language: 'uk',

      paragraphFormat: {
        N: 'Звичайний',
        H1: 'Заголовок 1',
        H2: 'Заголовок 2',
        H3: 'Заголовок 3',
        H4: 'Заголовок 4',
        PRE: 'Код',
        SMALL: 'Маленький',
      },

      pastePlain: true,
      quickInsertButtons: ['image', 'video', 'hr'],

      requestWithCredentials: true,

      theme: 'custom',

      toolbarButtons: buttons,
      toolbarButtonsMD: buttons,
      toolbarButtonsSM: buttons,
      toolbarButtonsXS: buttons,

      videoDefaultWidth: 0,
      videoEditButtons: ['videoReplace', 'videoRemove', '|', 'videoAlign', 'videoSize'],
      videoInsertButtons: ['videoBack', '|', 'videoByURL', 'videoEmbed'],
      videoMove: false,

      width: '100%',
    });

    const { html } = this.props;

    $editor.froalaEditor('html.set', html);

    $editor.on('keyup', () => this.sendContent($editor));
    $editor.on('froalaEditor.contentChanged', () => this.sendContent($editor));

    $editor.on('froalaEditor.video.inserted', (e, editor, $video) => {
      const videoSource = $video.contents().get(0).src;

      $video.html(`<iframe src="${videoSource}" frameborder="0" allowfullscreen class="aspect-ratio-16-9"></iframe>`);
    });
  }

  sendContent($editor) {
    let content;

    if ($editor.froalaEditor('codeView.isActive')) {
      content = $editor.froalaEditor('codeView.get').replace(/[\r\n]/g, '');
    } else {
      content = $editor.froalaEditor('html.get');
    }

    const { onChange } = this.props;

    onChange(content);
  }

  render() {
    return (
      <div className={styles.wrapper}>
        <link rel="stylesheet" href="/static/libs/froala/froala_style.min.css" />
        <link rel="stylesheet" href="/static/libs/froala/froala_editor.pkgd.min.css" />
        <link rel="stylesheet" href="/static/libs/froala/themes/custom.css" />
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.12.0/css/all.css" />
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.12.0/css/v4-shims.css" />
        <div className={EDITOR_CLASSNAME} />
      </div>
    );
  }
}

Editor.propTypes = {
  html: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

Editor.defaultProps = {
  html: '<p></p>',
};

export default Editor;

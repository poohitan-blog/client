import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { format, parse, isValid } from 'date-fns';

import { current } from 'config';

import Checkbox from 'components/ui/Checkbox';
import Editor from 'utils/editor';
import CodeEditor from 'utils/code-editor';
import TagSuggestions from 'components/admin/TagSuggestions';

import styles from 'styles/components/admin/post-form.module.scss';

const DATE_FORMAT = 'dd.MM.yyyy HH:mm';
const MAX_DESCRIPTION_LENGTH = 160;

const PostForm = ({ post, tagCloud, onChange }) => {
  const [title, setTitle] = useState(post.title);
  const [description, setDescription] = useState(post.description);
  const [slug, setSlug] = useState(post.slug);
  const [body, setBody] = useState(post.body);
  const [customStyles, setCustomStyles] = useState(post.customStyles);
  const [imagesWidth, setImagesWidth] = useState(post.imagesWidth);
  const [hidden, setHidden] = useState(post.hidden);

  const [tagsString, setTagsString] = useState(post.tags?.length ? post.tags.join(', ') : '');

  const date = new Date(post.publishedAt);
  const [dateString, setDateString] = useState(isValid(date) ? format(date, DATE_FORMAT) : '');

  const [
    descriptionSymbolsLeft,
    setDescriptionSymbolsLeft,
  ] = useState(MAX_DESCRIPTION_LENGTH - post.description.length);

  const getPostLinkMarkup = () => {
    const prefix = `${current.clientURL}/p`;
    const fullLink = `${prefix}/${slug}`;
    const isNewPost = !post.id;
    const postSlug = slug || post.slug || '';

    if (isNewPost) {
      return <span>{fullLink}</span>;
    }

    return <Link href={`/p/${postSlug}`}><a>{fullLink}</a></Link>;
  };

  const addTag = (value) => {
    if (tagsString.includes(value)) {
      return;
    }

    const tags = [
      ...tagsString
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag !== ''),
      value,
    ];

    setTagsString(tags.join(', '));
  };

  const handleDescriptionChange = (event) => {
    const { value } = event.target;

    setDescription(value);
    setDescriptionSymbolsLeft(MAX_DESCRIPTION_LENGTH - value.length);
  };

  const submit = async () => {
    if (!(title && body)) {
      // TODO: show error popup

      return;
    }

    const tags = tagsString.split(',').map((tag) => tag.trim()).filter((tag) => tag !== '');
    const publishedAt = dateString ? parse(dateString, DATE_FORMAT, new Date()) : new Date();
    const preparedTranslations = post.translations.map((translation) => translation.id || translation);

    onChange({
      id: post.id,
      title,
      description,
      body,
      slug,
      customStyles,
      imagesWidth,
      hidden,
      tags,
      publishedAt,
      translations: preparedTranslations,
    });
  };

  const formTitle = post.id ? 'Редагувати запис' : 'Додати запис';
  const link = getPostLinkMarkup();

  return (
    <div className={styles.wrapper}>
      <h1>{formTitle}</h1>
      <div className={styles.form}>
        <input
          type="text"
          placeholder="Назва"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <div className={styles.slug}>
          <input
            type="text"
            value={slug}
            placeholder="Адреса"
            onChange={(event) => setSlug(event.target.value)}
            className={styles.slugInput}
          />
          <div className={styles.slugPreview}>
            {link}
          </div>
        </div>
        <Editor html={body} onChange={(value) => setBody(value)} />
        <div>
          <p>Позначки (через кому):</p>
          <input
            type="text"
            value={tagsString}
            onChange={(event) => setTagsString(event.target.value)}
          />
          <TagSuggestions tags={tagCloud} onClick={addTag} />
        </div>
        <hr className={styles.separator} />
        <div>
          <div className={styles.shortDescription}>
            <p>Короткий опис:</p>
            <span className="smaller">{`Залишилось символів: ${descriptionSymbolsLeft}`}</span>
          </div>
          <textarea
            rows="3"
            value={description}
            onChange={handleDescriptionChange}
          />
        </div>
        <div>
          <p>Стилі сторінки:</p>
          <CodeEditor
            value={customStyles}
            onInput={(value) => setCustomStyles(value)}
            language="scss"
          />
        </div>
        {
          customStyles
            ? (
              <div>
                <span className="nowrap">Ширина зображень (у нерозгорнутому вигляді):</span>
                <input
                  type="number"
                  min={100}
                  max={5000}
                  value={imagesWidth}
                  onChange={(event) => setImagesWidth(event.target.value)}
                  className="margin-left"
                />
              </div>
            )
            : null
        }
        <div>
          <p>Картинка для соц. мереж:</p>

        </div>
        <hr className={styles.separator} />
        <div className={styles.translations}>
          <p>Переклади:</p>
          {
            post.translations?.length
              ? post.translations
                .map((translation) => (
                  <Link
                    key={translation.lang}
                    href={`/posts/${slug}/translations/${translation.lang}/edit`}
                  >
                    <a className={styles.translationLink}>
                      {translation.lang}
                      {translation.hidden ? <sup>(прих.)</sup> : null}
                    </a>
                  </Link>
                ))
              : null
          }
          <Link href={`/posts/${slug}/translations/new`}>
            <a className={styles.translationLink}>(Додати)</a>
          </Link>
        </div>
        <div className={styles.footer}>
          <div className={styles.options}>
            <input
              type="text"
              placeholder="DD.MM.YYYY HH:mm"
              value={dateString}
              onChange={(event) => setDateString(event.target.value)}
              pattern="[0-3][0-9]\.[0-1][0-9]\.[1-2][0-9][0-9][0-9] [0-2][0-9]:[0-5][0-9]"
              className={styles.date}
            />
            <Checkbox
              label="Заховати"
              checked={hidden}
              onChange={(value) => setHidden(value)}
            />
          </div>
          <button type="submit" onClick={submit} className={styles.submitButton}>Вйо</button>
        </div>
      </div>
    </div>
  );
};

PostForm.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    body: PropTypes.string,
    slug: PropTypes.string,
    description: PropTypes.string,
    hidden: PropTypes.bool,
    tags: PropTypes.arrayOf(PropTypes.string),
    imagesWidth: PropTypes.number,
    customStyles: PropTypes.string,
    publishedAt: PropTypes.instanceOf(Date),
    translations: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  tagCloud: PropTypes.shape({}).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default PostForm;

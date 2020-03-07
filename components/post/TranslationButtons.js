import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import { translatePostIsAvailableInThisLanguage, getCountryCodeByLanguageCode } from '../../services/translations';

import styles from '../../styles/components/post/translation-buttons.scss';

const Button = ({
  language, title, href, as,
}) => {
  const postIsAvailableInThisLanguage = translatePostIsAvailableInThisLanguage(language);
  const linkTitle = title ? `"${title}" — ${postIsAvailableInThisLanguage}` : postIsAvailableInThisLanguage;

  return (
    <Link
      href={href}
      as={as}
    >
      <a title={linkTitle}>
        <div className={`${styles.button} flag-icon flag-icon-background flag-icon-${getCountryCodeByLanguageCode(language)}`} />
      </a>
    </Link>
  );
};

const TranslationButtons = ({ translations, language, path }, context) => (
  <div className={styles.wrapper}>
    {
      language === 'uk'
        ? null
        : <Button key="uk" language="uk" href={`/post?path=${path}`} as={`/p/${path}`} />
    }
    {
      translations
        .filter((item) => (context.isAuthenticated ? true : !item.private))
        .filter((item) => item.lang !== language)
        .map((item) => (
          <Button
            key={item.lang}
            title={item.title}
            language={item.lang}
            href="/p/[slug]/[language]"
            as={`/p/${path}/${item.lang}`}
          />
        ))
    }
  </div>
);

Button.propTypes = {
  title: PropTypes.string,
  language: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  as: PropTypes.string.isRequired,
};

Button.defaultProps = {
  title: '',
};

TranslationButtons.propTypes = {
  path: PropTypes.string.isRequired,
  language: PropTypes.string,
  translations: PropTypes.arrayOf(PropTypes.object).isRequired,
};

TranslationButtons.defaultProps = {
  language: 'uk',
};

export default TranslationButtons;

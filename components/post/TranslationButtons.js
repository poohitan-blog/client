import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import { translatePostIsAvailableInThisLanguage, getCountryCodeByLanguageCode } from '../../services/translations';
import { Context as SessionContext } from '../../services/session';

import styles from '../../styles/components/post/translation-buttons.scss';

const Button = React.memo(({
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
});

const TranslationButtons = ({ translations, language, slug }) => (
  <SessionContext.Consumer>
    {({ isAuthenticated }) => (
      <div className={styles.wrapper}>
        {
          language === 'uk'
            ? null
            : <Button key="uk" language="uk" href="/p/[slug]" as={`/p/${slug}`} />
        }
        {
          translations
            .filter((item) => (isAuthenticated ? true : !item.hidden))
            .filter((item) => item.lang !== language)
            .map((item) => (
              <Button
                key={item.lang}
                title={item.title}
                language={item.lang}
                href="/p/[slug]/[language]"
                as={`/p/${slug}/${item.lang}`}
              />
            ))
        }
      </div>
    )}
  </SessionContext.Consumer>
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
  slug: PropTypes.string.isRequired,
  language: PropTypes.string,
  translations: PropTypes.arrayOf(PropTypes.object).isRequired,
};

TranslationButtons.defaultProps = {
  language: 'uk',
};

export default TranslationButtons;

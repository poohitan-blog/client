import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import { translatePostIsAvailableInThisLanguage, getCountryCodeByLanguageCode } from '../../services/translations';

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
        <div className={`post-translation-button flag-icon flag-icon-background flag-icon-${getCountryCodeByLanguageCode(language)}`} />
      </a>
    </Link>
  );
};

const TranslationButtons = ({ translations, language, path }, context) => (
  <div className="post-translation-buttons">
    {
      language && <Button key="uk" language="uk" href={`/post?path=${path}`} as={`/p/${path}`} />
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
            href={`/post?path=${path}&language=${item.lang}`}
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

TranslationButtons.contextTypes = {
  isAuthenticated: PropTypes.bool,
};

export default TranslationButtons;

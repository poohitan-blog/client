import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import { translatePostIsAvailableInThisLanguage, getCountryCodeByLanguageCode } from '../../services/translations';

const Button = ({ language, href, as }) => (
  <Link
    href={href}
    as={as}
  >
    <a title={translatePostIsAvailableInThisLanguage(language)}>
      <div className={`post-translation-button flag-icon flag-icon-background flag-icon-${getCountryCodeByLanguageCode(language)}`} />
    </a>
  </Link>
);

const TranslationButtons = ({ translations, language, path }) => (
  <div className="post-translation-buttons">
    {
      language && <Button key="uk" language="uk" href={`/post?path=${path}`} as={`/p/${path}`} />
    }
    {
      translations
        .filter(item => item.lang !== language)
        .map(item => (
          <Button
            key={item.lang}
            language={item.lang}
            href={`/post?path=${path}&language=${item.lang}`}
            as={`/p/${path}?language=${item.lang}`}
          />
        ))
    }
  </div>
);

Button.propTypes = {
  language: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  as: PropTypes.string.isRequired,
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

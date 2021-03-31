import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useSession } from 'next-auth/client';
import cc from 'classcat';

import { translatePostIsAvailableInThisLanguage, getCountryCodeByLanguageCode } from 'services/translations';

import styles from 'styles/components/post/translation-buttons.module.scss';

const Button = React.memo(({
  language, title, href,
}) => {
  const postIsAvailableInThisLanguage = translatePostIsAvailableInThisLanguage(language);
  const linkTitle = title ? `"${title}" — ${postIsAvailableInThisLanguage}` : postIsAvailableInThisLanguage;
  const className = cc([
    styles.button,
    'flag-icon',
    'flag-icon-background',
    `flag-icon-${getCountryCodeByLanguageCode(language)}`,
  ]);

  return (
    <Link href={href}>
      <a title={linkTitle}>
        <div className={className} />
      </a>
    </Link>
  );
});

function TranslationButtons({ translations, language, slug }) {
  const [session] = useSession();

  return (
    <div className={styles.wrapper}>
      {
        language === 'uk' ? null : <Button key="uk" language="uk" href={`/p/${slug}`} />
      }
      {
        translations
          .filter((item) => (session ? true : !item.hidden))
          .filter((item) => item.lang !== language)
          .map((item) => (
            <Button
              key={item.lang}
              title={item.title}
              language={item.lang}
              href={`/p/${slug}/${item.lang}`}
            />
          ))
      }
    </div>
  );
}

Button.propTypes = {
  title: PropTypes.string,
  language: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
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

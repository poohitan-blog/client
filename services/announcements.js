import React from 'react';

import random from '../helpers/random';
import getWebsiteInfo from '../helpers/get-website-info';
import { describeWordCount } from './grammar';

import HeartIcon from '../public/static/icons/heart.svg';
import CakeIcon from '../public/static/icons/cake.svg';

const DEFAULT_PHRASES = [
  'Читай українською',
  'Пиши українською',
  'Спілкуйся українською',
  'Шукай українською',
  'Думай українською',
  'Наша мова кольорова',
];

export const POSITIONS = {
  TOP: 'top',
  BOTTOM: 'bottom',
};

const POSITION_STORAGE_KEY_NAME = 'announcementPosition';

export const Context = React.createContext({
  position: 'bottom',
});

Context.displayName = 'AnnouncementContext';

function getCurrentPosition() {
  if (typeof window === 'undefined') {
    throw new Error('Announcement must be used client-side only');
  }

  const isSmallScreen = global.matchMedia('(max-width: 600px)').matches;

  if (isSmallScreen) {
    return POSITIONS.BOTTOM;
  }

  const { sessionStorage } = global;

  const currentPosition = global.sessionStorage.getItem(POSITION_STORAGE_KEY_NAME);

  if (currentPosition) {
    return currentPosition;
  }

  const position = random({ min: 0, max: 10 }) <= 9 ? POSITIONS.BOTTOM : POSITIONS.TOP;

  sessionStorage.setItem(POSITION_STORAGE_KEY_NAME, position);

  return position;
}

export function generateRandomAnnouncement() {
  const phraseIndex = random({ min: 0, max: DEFAULT_PHRASES.length - 1 });

  return {
    position: getCurrentPosition(),
    text: DEFAULT_PHRASES[phraseIndex],
    Icon: HeartIcon,
  };
}

export function getAnnouncement() {
  const { isBirthday, age } = getWebsiteInfo();

  if (isBirthday) {
    const text = `${describeWordCount(age, ['рік', 'роки', 'років'])} сайту`;

    return {
      text,
      position: POSITIONS.TOP,
      Icon: CakeIcon,
    };
  }

  return generateRandomAnnouncement();
}

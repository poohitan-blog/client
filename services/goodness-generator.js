import random from '../helpers/random';

const PHRASES = [
  'Читай українською',
  'Пиши українською',
  'Спілкуйся українською',
  'Шукай українською',
  'Думай українською',
  'Наша мова кольорова',
];

const POSITION_STORAGE_KEY_NAME = 'goodnessGeneratorPosition';
const POSITIONS = {
  TOP: 'top',
  BOTTOM: 'bottom',
};

export function getPosition() {
  if (typeof window === 'undefined') {
    throw new Error('Goodness Generator must be used client-side only');
  }

  const { sessionStorage } = global;

  const currentPosition = sessionStorage.getItem(POSITION_STORAGE_KEY_NAME);

  if (currentPosition) {
    return currentPosition;
  }

  const position = random({ min: 0, max: 10 }) <= 9 ? POSITIONS.BOTTOM : POSITIONS.TOP;

  sessionStorage.setItem(POSITION_STORAGE_KEY_NAME, position);

  return position;
}

export function getPhrase() {
  const index = random({ min: 0, max: PHRASES.length - 1 });
  return PHRASES[index];
}

export default {
  getPosition,
  getPhrase,
};

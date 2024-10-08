import React from "react";

import random from "helpers/random";
import getWebsiteInfo from "helpers/get-website-info";
import { describeWordCount } from "services/grammar";

import HeartIcon from "static/icons/heart.svg";
import CakeIcon from "static/icons/cake.svg";
import GhostIcon from "static/icons/ghost.svg";

const WAR_IN_PROGRESS = true;

const DEFAULT_PHRASES = [
  {
    text: "Читай українською",
  },
  {
    text: "Пиши українською",
  },
  {
    text: "Спілкуйся українською",
  },
  {
    text: "Шукай українською",
  },
  {
    text: "Думай українською",
  },
  {
    text: "Наша мова кольорова",
  },
  {
    text: "Аваков — чорт",
  },
  {
    text: "Вакцинуйся, чорт забирай!",
  },
];

const DONATIONS_PHRASE = {
  text: "Скидай гроші на Русоріз",
  link: "https://send.monobank.ua/jar/dzBdJ3737",
};

export const POSITIONS = {
  TOP: "top",
  BOTTOM: "bottom",
};

const POSITION_STORAGE_KEY_NAME = "announcementPosition";

export const Context = React.createContext({
  position: "bottom",
});

Context.displayName = "AnnouncementContext";

function getCurrentPosition() {
  if (typeof window === "undefined") {
    throw new Error("Announcement must be used client-side only");
  }

  const isSmallScreen = global.matchMedia("(max-width: 600px)").matches;

  if (isSmallScreen) {
    return POSITIONS.BOTTOM;
  }

  const { sessionStorage } = global;

  const currentPosition = global.sessionStorage.getItem(
    POSITION_STORAGE_KEY_NAME
  );

  if (currentPosition) {
    return currentPosition;
  }

  const position =
    random({ min: 0, max: 10 }) <= 9 ? POSITIONS.BOTTOM : POSITIONS.TOP;

  sessionStorage.setItem(POSITION_STORAGE_KEY_NAME, position);

  return position;
}

export function generateRandomAnnouncement() {
  const phraseIndex = random({ min: 0, max: DEFAULT_PHRASES.length - 1 });
  const phrase = DEFAULT_PHRASES[phraseIndex];

  return {
    position: getCurrentPosition(),
    text: phrase.text,
    link: phrase.link,
    Icon: HeartIcon,
  };
}

export function generateAnnouncement() {
  const { isBirthday, age } = getWebsiteInfo();
  const isDead = false; // TODO: make a check from API

  if (isBirthday) {
    const text = `${describeWordCount(age, ["рік", "роки", "років"])} сайту`;

    return {
      text,
      position: POSITIONS.TOP,
      Icon: CakeIcon,
    };
  }

  if (isDead) {
    const text = "Я помер. Сайт більше не оновлюється";

    return {
      text,
      position: POSITIONS.TOP,
      Icon: GhostIcon,
    };
  }

  if (WAR_IN_PROGRESS) {
    return {
      ...DONATIONS_PHRASE,
      position: POSITIONS.TOP,
      Icon: HeartIcon,
    };
  }

  return generateRandomAnnouncement();
}

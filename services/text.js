export function stripHTML(html, { preserveWhitespace = false } = {}) {
  return preserveWhitespace
    ? html.replace(/<.+?>/g, '')
    : html.replace(/<.+?>|\n/g, ' ').replace(/ +/g, ' ').trim();
}

export function shorten(text, wordsCount) {
  const words = text.split(' ');

  if (words.length <= wordsCount) {
    return text;
  }

  const shortenedText = words.slice(0, wordsCount).join(' ');

  return `${shortenedText}…`;
}

export function getHighlightsOfKeywords({ text, keywords, margin = 7 }) {
  const words = text.split(' ');
  const occurencesOfKeyword = [];
  const regexes = keywords.map(keyword => new RegExp(keyword, 'i'));

  words.forEach((word, position) => {
    if (regexes.some(regex => regex.test(word))) {
      occurencesOfKeyword.push({ position, word });
    }
  });

  const highlights = occurencesOfKeyword
    .map(({ position, word }) => {
      const beginsAt = Math.max(position - margin, 0);
      const endsAt = Math.min(position + 1 + margin, words.length);
      const wordsBeforeKeyword = words.slice(beginsAt, position);
      const wordsAfterKeyword = words.slice(position + 1, endsAt);

      const highlight = [...wordsBeforeKeyword, word, ...wordsAfterKeyword].join(' ');

      return { text: highlight, beginsAt, endsAt };
    })
    .reduce((previousHighlights, currentHighlight) => {
      if (!previousHighlights.length) {
        return [currentHighlight];
      }

      const previousHighlight = previousHighlights[previousHighlights.length - 1];

      if (previousHighlight.endsAt < currentHighlight.beginsAt) {
        return [...previousHighlights, currentHighlight];
      }

      const overlap = Math.abs(currentHighlight.beginsAt - previousHighlight.endsAt);
      const previousHighlightWords = previousHighlight.text.split(' ');
      const previousHighlightWithoutOverlap = previousHighlightWords
        .slice(0, previousHighlightWords.length - overlap).join(' ');

      const concatenatedText = [previousHighlightWithoutOverlap, currentHighlight.text].join(' ');

      const highlightsBeforePrevious = previousHighlights.slice(0, previousHighlights.length - 1);

      return [...highlightsBeforePrevious, {
        text: concatenatedText,
        beginsAt: previousHighlight.beginsAt,
        endsAt: currentHighlight.endsAt,
      }];
    }, [])
    .map((highlight, index, array) => {
      let { text } = highlight; // eslint-disable-line

      if (index === array.length - 1 && highlight.endsAt < words.length) {
        text = `${text}…`;
      }

      if (index === 0 && highlight.beginsAt > 0) {
        text = `…${text}`;
      }

      return text;
    });

  return highlights;
}

export function getImageLinksFromHTML(html) {
  const regex = /<img(?:.+?)src="(.+?)"/gi;
  const images = [];
  let match = regex.exec(html);

  while (match) {
    images.push(match[1]);

    match = regex.exec(html);
  }

  return images;
}

export function wrapImagesInLinks(html, { imagesClass = '' } = {}) {
  const regex = /<img .*?src="(.+?)".*?\/?>/g;
  const matches = [];
  let match = regex.exec(html);

  while (match) {
    matches.push(match);
    match = regex.exec(html);
  }

  return matches.reduce((resultHtml, [imageTag, imageLink]) =>
    resultHtml.replace(imageTag, `<a href="${imageLink}" class="${imagesClass}">${imageTag}</a>`), html);
}

export default {
  stripHTML,
  getImageLinksFromHTML,
  wrapImagesInLinks,
  shorten,
};

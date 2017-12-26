export function stripHTML(html) {
  return html.replace(/<.+?>|\n/g, ' ').replace(/ +/g, ' ').trim();
}

export function shorten(text, wordsCount) {
  return text.split(' ').slice(0, wordsCount).join(' ');
}

export function getImagesFromHTML(html) {
  const regex = /<img(?:.+?)src="(.+?)"/gi;
  const images = [];
  let match = regex.exec(html);

  while (match) {
    images.push(match[1]);

    match = regex.exec(html);
  }

  return images;
}

export default { stripHTML, getImagesFromHTML, shorten };

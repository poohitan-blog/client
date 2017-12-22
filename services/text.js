export function stripHTML(html) {
  return html.replace(/<.+?>|\n/g, ' ').replace(/ +/g, ' ').trim();
}

export function shorten(text, wordsCount) {
  return text.split(' ').slice(0, wordsCount).join(' ');
}

export default { stripHTML, shorten };

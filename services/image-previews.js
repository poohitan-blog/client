import { getImageLinksFromHTML } from './text';

const PREVIEW_PARAM = ':preview';

export function replaceOriginalImagesWithPreviews(html) {
  const imageLinks = getImageLinksFromHTML(html);

  return imageLinks.reduce((result, link, index) =>
    result.replace(`src="${link}"`, `src="${link}${PREVIEW_PARAM}" data-preview-id="${index}"`), html);
}

export function loadOriginalImages(html) {
  const imageLinks = getImageLinksFromHTML(html);

  imageLinks.forEach((link, index) => {
    const previewImage = global.document.querySelector(`img[src="${link}${PREVIEW_PARAM}"][data-preview-id="${index}"]`);

    if (!previewImage) {
      return;
    }

    const originalImage = global.document.createElement('img');

    originalImage.onload = function () {
      previewImage.src = this.src;
    };
    originalImage.src = link;
  });
}

export default { replaceOriginalImagesWithPreviews, loadOriginalImages };

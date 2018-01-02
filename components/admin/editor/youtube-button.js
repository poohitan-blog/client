export default {
  name: 'youtube',
  tooltip: 'Youtube video',
  iconURL: '/static/icons/youtube.svg',
  popup(editor, current, control, close) {
    const input = global.document.createElement('input');
    input.type = 'text';
    input.placeholder = 'https://…';

    const button = global.document.createElement('button');
    button.textContent = 'Вставити';

    const form = global.document.createElement('form');
    form.classList.add('children-equal-margin-vertical');

    form.appendChild(input);
    form.appendChild(button);

    const selection = editor.selection.save();

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const link = input.value;
      const videoIdRegexes = [/v=(\w+)/, /youtu\.be\/(\w+)/];
      const matches = videoIdRegexes
        .map(regex => link.match(regex))
        .reduce((resultArray, matchArray) => (matchArray ? [...resultArray, ...matchArray] : resultArray), []);
      const videoId = matches.length ? matches[1] : null;
      const embedUrl = `//youtube.com/embed/${videoId}`;

      editor.selection.restore(selection);
      editor.selection.insertHTML(`<div class="video-16-9"><iframe src="${embedUrl}" allowfullscreen="" frameborder="0"></iframe></div>`);

      close();
    });

    return form;
  },
};

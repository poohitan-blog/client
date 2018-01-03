export default {
  name: 'youtube',
  tooltip: 'Відео з Youtube',
  iconURL: '/static/icons/youtube.svg',
  popup(editor, current, control, close) {
    const input = global.document.createElement('input');
    input.type = 'text';
    input.placeholder = 'https://…';

    const button = global.document.createElement('button');
    button.textContent = 'Вставити';

    const form = global.document.createElement('form');
    form.classList.add('jodit_form');

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

      if (!videoId) {
        return;
      }

      const embedUrl = `//youtube.com/embed/${videoId}`;

      editor.selection.restore(selection);
      editor.selection.insertHTML(`<p class="video-16-9"><iframe src="${embedUrl}" allowfullscreen="" frameborder="0"></iframe></p>`);

      close();
    });

    return form;
  },
};

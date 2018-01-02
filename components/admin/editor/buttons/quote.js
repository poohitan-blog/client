export default {
  name: 'quote',
  tooltip: 'Цитата',
  iconURL: '/static/icons/quote.svg',
  popup(editor, current, control, close) {
    const textarea = global.document.createElement('textarea');
    textarea.classList.add('smaller');

    const button = global.document.createElement('button');
    button.textContent = 'Вставити';

    const form = global.document.createElement('form');
    form.classList.add('jodit_form');
    form.classList.add('editor-quote-plugin');

    form.appendChild(textarea);
    form.appendChild(button);

    const selection = editor.selection.save();

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const text = textarea.value;

      editor.selection.restore(selection);
      editor.selection.insertHTML(`<blockquote>${text}</blockquote>`);

      close();
    });

    return form;
  },
};

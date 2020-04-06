$.FroalaEditor.DefineIcon('custom-quote', { NAME: 'quote-right' });
$.FroalaEditor.RegisterCommand('custom-quote', {
  title: 'Вставити цитату',
  focus: true,
  undo: true,
  refreshAfterCallback: true,
  callback() {
    this.format.apply('div', { class: 'blockquote' });
  },
});

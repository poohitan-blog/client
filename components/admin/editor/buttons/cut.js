$.FroalaEditor.DefineIcon('cut', { NAME: 'scissors' });
$.FroalaEditor.RegisterCommand('cut', {
  title: 'Вставити кат',
  focus: true,
  undo: true,
  refreshAfterCallback: true,
  callback() {
    this.html.insert('<cut></cut>', false);
  },
});

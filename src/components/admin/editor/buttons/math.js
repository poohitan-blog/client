$.FroalaEditor.DefineIcon('math', { NAME: 'square-root-alt' });
$.FroalaEditor.RegisterCommand('math', {
  title: 'Вставити LaTeX',
  focus: true,
  undo: true,
  refreshAfterCallback: true,
  callback() {
    this.format.apply('math');
  },
});

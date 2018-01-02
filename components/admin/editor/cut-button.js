export default {
  name: 'cut',
  tooltip: 'Cut',
  iconURL: '/static/icons/scissors.svg',
  exec(editor) {
    const hasCutAlready = editor.getEditorValue().includes('<cut>');

    if (hasCutAlready) {
      return;
    }

    editor.selection.insertHTML('<cut></cut>');
  },
};

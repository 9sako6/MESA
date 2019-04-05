$(document).ready(function () {
  var editor = ace.edit("text-editor");
  editor.setTheme("ace/theme/monokai");
  editor.setFontSize(14);
  editor.getSession().setUseWrapMode(true); // 折り返し有効
  editor.getSession().setMode("ace/mode/xml");
});
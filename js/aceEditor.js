var editor = ace.edit("text-editor");
editor.setTheme("ace/theme/monokai");
editor.setFontSize(16);
editor.getSession().setUseWrapMode(true); // 折り返し有効
editor.getSession().setMode("ace/mode/html");

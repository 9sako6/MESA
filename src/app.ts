import $ from "jquery";
import MesaController from "./MesaController";
import "../css/style.scss";

$(document).ready(function() {
  new MesaController();

  var editor = ace.edit("text-editor");
  editor.setTheme("ace/theme/monokai");
  editor.setFontSize("14px");
  editor.getSession().setUseWrapMode(true); // 折り返し有効
  editor.getSession().setMode("ace/mode/xml");
});

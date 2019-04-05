class MesaModel {
  editor: AceAjax.Editor;
  tagListJson: Array<any>; // todo: fix
  addedTagListJson: Array<any>; // todo: fix
  constructor() {
    // init
    this.editor = ace.edit("text-editor");
    this.tagListJson = [];
    this.addedTagListJson = [];
  }
}

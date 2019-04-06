interface Tag {
  name: string,
  sepChar: string,
  xmlFlag: boolean
}

class MesaModel {
  editor: AceAjax.Editor;
  tagListJson: Tag[];
  addedTagListJson: Tag[];
  constructor() {
    // init
    this.editor = ace.edit("text-editor");
    this.tagListJson = [];
    this.addedTagListJson = [];
  }
}

class MesaModel {
  constructor() {
    // テキストを保持
    this.text = "";
    // 前回のテキストを保持
    this.textHistory = ""; // もっとましな実装
    // JSONを保持
    this.tagListJson = [];
    this.addedTagListJson = [];
  }
}

class MesaController {
  constructor() {
    this.model = new MesaModel();
    this.view = new MesaView();
    this.loadTextFile(this.model, this.view);
    this.loadJsonFile(this.model, this.view);
    this.insertTag(this.model, this.view);
    this.insertXMLTag(this.model, this.view);
    this.addTag(this.model, this.view);
    this.undo(this.model, this.view);
    this.downloadText(this.model, this.view);
    this.downloadJson(this.model, this.view);
  }

  loadTextFile(model, view, evt) {
    // テキストファイル読み込み
    $('#upload-button').on('change', function(evt) {
      var file = evt.target.files;
      // FileReaderの作成
      var reader = new FileReader();
      // テキスト形式で読み込む
      reader.readAsText(file[0]);
      // 読込終了後の処理
      reader.onload = function() {
        // modelにテキスト保持
        model.text = reader.result;
        // テキストエリアに表示する
        view.writeTextArea(model.text);
      }
    });
  }

  // JSONの読み込み（load-tags-buttonボタンが押されたら）
  loadJsonFile(model, view) {
    $('#load-tags-button').on('change', function(evt) {
      var file = evt.target.files;
      // FileReaderの作成
      var reader = new FileReader();
      // テキスト形式で読み込む
      reader.readAsText(file[0]);
      // 読込終了後の処理
      reader.onload = function() {
        // modelにjson保持
        var json = JSON.parse(reader.result)
        if (json) {
          model.tagListJson = json;
        }
        // model.tagListJson = JSON.parse(reader.result);
        // tagボタンを作る
        view.makeTagButton(model.tagListJson);
      }
    });
  }

  insertTag(model, view) {
    // タグの挿入
    // 親要素である#tagsに対してイベントを設定しないとjson読み込んで追加したボタンが動かない
    $('#tags').on('click', '.tag-btn', function() {
      var textarea = document.getElementById('user-text');

      var text = textarea.value;
      var textLen = text.length;
      var cursorPos = textarea.selectionStart;

      var former = text.substr(0, cursorPos);
      var insertString = $(this).attr("val");
      var latter = text.substr(cursorPos, textLen);
      model.textHistory = text; // 変更前のテキストを保持
      text = former + insertString + latter;
      textarea.value = text;
    });
  }

  insertXMLTag(model, view) {
    // XMLタグの挿入
    // 親要素である#tagsに対してイベントを設定しないとjson読み込んで追加したボタンが動かない
    $('#tags').on('click', '.xml-tag-btn', function() {
      var textarea = document.getElementById('user-text');

      var text = textarea.value;
      var textLen = text.length;
      // カーソル位置の取得
      var cursorPosStart = textarea.selectionStart;
      var cursorPosEnd = textarea.selectionEnd;
      var selectedRange = cursorPosEnd - cursorPosStart;

      var former = text.substr(0, cursorPosStart);
      var middle = text.substr(cursorPosStart, selectedRange);
      var beginTag = "<" + $(this).attr("val") + ">";
      var endTag = "</" + $(this).attr("val") + ">";
      var latter = text.substr(cursorPosEnd, textLen - cursorPosEnd);
      model.textHistory = text; // 変更前のテキストを保持
      text = former + beginTag + middle + endTag + latter;
      textarea.value = text;
    });
  }

  addTag(model, view) {
    $('#add-tag-btn').on('click', function() {
      var name = document.getElementById('tag-name-form').value || "name";
      var sepChar = document.getElementById('tag-sep-form').value || "\t";
      var xmlFlag = document.getElementById('xml-flag').checked;
      var newTag = {"name":name, "sepChar":sepChar, "xmlFlag":xmlFlag};
      model.addedTagListJson.push(newTag);
      view.makeTagButton([newTag]);
    });
  }

  undo(model, view) {
    // undo(1回前の内容を保存しておいて戻す)
    $('#undo-btn').on('click', function() {
      var textarea = document.getElementById('user-text');
      textarea.value = model.textHistory;
    });
  }

  downloadText(model, view) {
    //download text file
    document.querySelector('#text-donwload').addEventListener('click', (e) => e.target.href = URL.createObjectURL(new Blob([document.getElementById('user-text').value], {
        type: "text/plain"
    })))
    // $('#text-download').on('click', function(evt) {
    //   evt.target.href = URL.createObjectURL(
    //     new Blob([document.getElementById('user-text').value],{ type: "text/plain" })
    //   )
    // })
  }

  downloadJson(model, view) {
    //download json file
    document.querySelector('#json-donwload').addEventListener('click', (e) => e.target.href = URL.createObjectURL(new Blob([JSON.stringify(model.tagListJson.concat(model.addedTagListJson), null, 2)], {
        type: "text/plain"
    })))

  }
}

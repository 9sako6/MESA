class MesaController {
  constructor() {
    // init
    this.model = new MesaModel();
    this.view = new MesaView();
    // events
    this.loadTextFile(this.model, this.view);
    this.loadJsonFile(this.model, this.view);
    this.insertTag(this.model, this.view);
    this.insertXMLTag(this.model, this.view);
    this.addTag(this.model, this.view);
    this.downloadText(this.model, this.view);
    this.downloadJson(this.model, this.view);
  }

  loadTextFile(model, view) {
    $('#upload-button').on('change', function(evt) {
      var file = evt.target.files;
      // FileReaderの作成
      var reader = new FileReader();
      // テキスト形式で読み込む
      reader.readAsText(file[0]);
      // 読込終了後の処理
      reader.onload = function() {
        view.writeTextArea(reader.result, model);
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
        // tagボタンを作る
        view.makeTagButton(model.tagListJson);
      }
    });
  }

  insertTag(model, view) {
    // 親要素である#tagsに対してイベントを設定しないとjson読み込んで追加したボタンが動かない
    $('#tags').on('click', '.tag-btn', function() {
      var insertString = $(this).attr("val");
      var selections = model.editor.getSelection().getAllRanges();
      // insert all positions
      for (let selection of selections) {
        if (selection.cursor) {
          model.editor.session.insert(selection.cursor, insertString);
        } else {
          model.editor.session.insert(selection.end, insertString);
        }
      }
    });
  }

  insertXMLTag(model, view) {
    // 親要素である#tagsに対してイベントを設定しないとjson読み込んで追加したボタンが動かない
    $('#tags').on('click', '.xml-tag-btn', function() {
      var selections = model.editor.getSelection().getAllRanges();
      var beginTag = "<" + $(this).attr("val") + ">";
      var endTag = "</" + $(this).attr("val") + ">";
      // insert all positions
      for (let selection of selections) {
        // the order (endTag -> beginTag) is important
        // in the case: position.start = position.end
        model.editor.session.insert(selection.end, endTag);
        model.editor.session.insert(selection.start, beginTag);
      }
    });
  }

  addTag(model, view) {
    $('#add-tag-btn').on('click', function() {
      var name = document.getElementById('tag-name-form').value || "name";
      var sepChar = document.getElementById('tag-sep-form').value || "\t";
      var xmlFlag = document.getElementById('xml-flag').checked;
      var newTag = {
        "name": name,
        "sepChar": sepChar,
        "xmlFlag": xmlFlag
      };
      model.addedTagListJson.push(newTag);
      view.makeTagButton([newTag]);
      view.showAddedMsg(newTag);
    });
  }

  downloadText(model, view) {
    // download text file
    document.querySelector('#text-donwload').addEventListener('click', (e) => e.target.href = URL.createObjectURL(new Blob([model.editor.session.getValue()], {
        type: "text/plain"
    })))
  }

  downloadJson(model, view) {
    //download json file
    document.querySelector('#json-donwload').addEventListener('click', (e) => e.target.href = URL.createObjectURL(new Blob([JSON.stringify(model.tagListJson.concat(model.addedTagListJson), null, 2)], {
      type: "text/plain"
    })))

  }
}

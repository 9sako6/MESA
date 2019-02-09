$(document).ready(function() {
  // テキストファイル読み込み
  var upload_button = document.getElementById("upload_button");
  // ダイアログでファイルが選択された時
  upload_button.addEventListener("change", function(evt) {
    var file = evt.target.files;
    // FileReaderの作成
    var reader = new FileReader();
    // テキスト形式で読み込む
    reader.readAsText(file[0]);
    // 読込終了後の処理
    reader.onload = function() {
      // テキストエリアに表示する
      document.getElementById("user_text").value = reader.result;
    }
  });

  // undoのために前回の内容を保持
  var before_text = document.getElementById('user_text').value; // もっとましな実装

  // insert string
  // 親要素である#tagsに対してイベントを設定しないとjson読み込んで追加したボタンが動かない
  $('#tags').on('click', '.tag_btn', function() {
    var textarea = document.getElementById('user_text');

    var text = textarea.value;
    var text_len = text.length;
    var cursor_pos = textarea.selectionStart;

    var former = text.substr(0, cursor_pos);
    var insert_string = $(this).attr("val");
    var latter = text.substr(cursor_pos, text_len);
    before_text = text; // 変更前のテキストを保持
    text = former + insert_string + latter;
    textarea.value = text;
  });

  // insert XML tag
  // 親要素である#tagsに対してイベントを設定しないとjson読み込んで追加したボタンが動かない
  $('#tags').on('click', '.xml_tag_btn', function() {
    var textarea = document.getElementById('user_text');

    var text = textarea.value;
    var text_len = text.length;
    var cursor_pos_start = textarea.selectionStart;
    var cursor_pos_end = textarea.selectionEnd;
    var selected_range = cursor_pos_end - cursor_pos_start;

    var former = text.substr(0, cursor_pos_start);
    var middle = text.substr(cursor_pos_start, selected_range);
    var begin_tag = "<" + $(this).attr("val") + ">";
    var end_tag = "</" + $(this).attr("val") + ">";
    var latter = text.substr(cursor_pos_end, text_len - cursor_pos_end);
    before_text = text; // 変更前のテキストを保持
    text = former + begin_tag + middle + end_tag + latter;
    console.log(middle);
    console.log(begin_tag);
    console.log(end_tag);
    console.log(cursor_pos_start);
    console.log(cursor_pos_end);
    textarea.value = text;
  });

  // undo
  $('#undo_btn').on('click', function() {
    var textarea = document.getElementById('user_text');
    textarea.value = before_text;
  });

  // json(tagのリスト)読み込み
  var load_tags_button = document.getElementById("load_tags_button");
  var tag_list_json = null;
  // ダイアログでファイルが選択された時
  load_tags_button.addEventListener("change", function(evt) {
    var file = evt.target.files;
    // FileReaderの作成
    var reader = new FileReader();
    // テキスト形式で読み込む
    reader.readAsText(file[0]);
    // 読込終了後の処理
    reader.onload = function() {
      // json parse
      tag_list_json = JSON.parse(reader.result);
      // tabボタンを作る
      make_tag_btn(tag_list_json);
    }
  });
  // add tag
  $('#add_tag_btn').on('click', function() {
    var name = document.getElementById('tag_name_form').value || "name";
    var sep_char = document.getElementById('tag_sep_form').value || "\t";
    // var value = document.getElementById('tag_value_form').value || "value";
    var xml_flag = document.getElementById('xml_or_not').checked;
    // textarea.value = before_text;
    var new_tag = {"name":name, "sep_char":sep_char, "xml_or_not":xml_flag};
    if (tag_list_json){
      tag_list_json.push(new_tag);
    } else {
      tag_list_json = [new_tag];
    }
    // console.log(tag_list_json);
    make_tag_btn([new_tag]);
  });

  //download text file
  document.querySelector('#text_donwload').addEventListener('click', (e) => e.target.href = URL.createObjectURL(new Blob([document.getElementById('user_text').value], {
      type: "text/plain"
  })))

  //download json file
  document.querySelector('#json_donwload').addEventListener('click', (e) => e.target.href = URL.createObjectURL(new Blob([JSON.stringify(tag_list_json, null, 2)], {
      type: "text/plain"
  })))

});

// 読み込んだjsonを元にタグボタンを作る
function make_tag_btn(json) {
  for (let tag of json) {
    if (tag.xml_or_not) {
      var added_elem = '<div class="func_btn xml_tag_btn" val="' + tag.name + '">' + tag.name + '</div>';
      $('#tags').append(added_elem);
    } else {
      var added_elem = '<div class="func_btn tag_btn" val="' + tag.sep_char + tag.name + '">' + tag.name + '</div>';
      $('#tags').append(added_elem);
    }
  }
}

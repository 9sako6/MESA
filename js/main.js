$(document).ready(function(){
  // テキストファイル読み込み
  var upload_button = document.getElementById("upload_button");
  // ダイアログでファイルが選択された時
  upload_button.addEventListener("change" ,function(evt){
    var file = evt.target.files;
    // FileReaderの作成
    var reader = new FileReader();
    // テキスト形式で読み込む
    reader.readAsText(file[0]);
    // 読込終了後の処理
    reader.onload = function(){
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
		text = former + "\t" + insert_string + latter;
		textarea.value = text;
	});

  // undo
  $('#undo_btn').on('click', function(e) {
    var textarea = document.getElementById('user_text');
    textarea.value = before_text;
  });


  // json(tagのリスト)読み込み
  var load_tags_button = document.getElementById("load_tags_button");
  // ダイアログでファイルが選択された時
  load_tags_button.addEventListener("change" ,function(evt){
    var file = evt.target.files;
    // FileReaderの作成
    var reader = new FileReader();
    // テキスト形式で読み込む
    reader.readAsText(file[0]);
    // 読込終了後の処理
    reader.onload = function(){
      // json parse
      var tag_list_json = JSON.parse(reader.result);
      // tabボタンを作る
      make_tag_btn(tag_list_json);
    }

  });
});

// 読み込んだjsonを元にタグボタンを作る
function make_tag_btn(json) {
  for(let tag of json){
    var added_elem = '<div class="func_btn tag_btn" val="' + tag.value + '">' + tag.name + '</div>'
    $('#tags').append(added_elem);
  }
}
// download file
// 保存するとテキストエリアの中が消える
// $(document).ready(function(){
// var btn = document.getElementById('download');
// btn.addEventListener('click', function() {
//
//     // テキストエリアから入力内容を取得する
//     var content = document.getElementById('user-text').value;
//
//     // テキストファイルをBlob形式に変換する
//     let blob = new Blob([content]);
//
//     // Blobデータに対するURLを発行する
//     let blobURL = window.URL.createObjectURL(blob);
//
//     // URLをaタグに設定する
//     let a = document.createElement('a');
//     a.href = blobURL;
//
//     // download属性でダウンロード時のファイル名を指定
//     a.download = 'content.txt';
//
//     // Firefoxの場合は、実際にDOMに追加しておく必要がある
//     document.body.appendChild(a);
//
//     // CLickしてダウンロード
//     a.click();
//
//     // 終わったら不要なので要素を削除
//     a.parentNode.removeChild(a);
// });
// });

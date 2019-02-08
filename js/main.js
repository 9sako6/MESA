// テキストファイル読み込み
document.addEventListener("DOMContentLoaded", function(){
  var obj1 = document.getElementById("selfile");

  //ダイアログでファイルが選択された時
  obj1.addEventListener("change" ,function(evt){

    var file = evt.target.files;

    //FileReaderの作成
    var reader = new FileReader();
    //テキスト形式で読み込む
    reader.readAsText(file[0]);

    //読込終了後の処理
    reader.onload = function(){
      //テキストエリアに表示する
      document.test.txt.value = reader.result;
    }
  }, false);
}, false);

// 文字列挿入
$(document).ready(function(){
	$('.tag-btn').on('click', function(e) {
		var textarea = document.querySelector('textarea#user-text');

		var text_val = textarea.value;
		var text_len      = text_val.length;
		var kersol_pos      = textarea.selectionStart;

		var first   = text_val.substr(0, kersol_pos);
		var insert     = $(this).attr("val");
		var latter    = text_val.substr(kersol_pos, text_len);
		text_val = first + "\t" + insert + latter;
		textarea.value = text_val;
	});
});

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

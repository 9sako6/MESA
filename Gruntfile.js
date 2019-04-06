// source: https://tracpath.com/works/devops/the-javascript-taskrunner-grunt/

module.exports = function (grunt) {
  grunt.initConfig({
    // ここにプラグインの設定を記述する
    concat: {
      options: {

      },
      dist: {
        // 結合するファイルを指定する
        src: [
          "src/aceEditor.js",
          "src/MesaModel.js",
          "src/MesaView.js",
          "src/MesaController.js",
          "src/init.js"
        ],
        // 出力するファイルを指定する
        dest: "build/mesa.js"
      }
    },
    uglify: {
      target: {
        files: {
          // 出力するファイル: ミニファイするファイル
          "build/mesa.min.js": "build/mesa.js"
        }
      }
    }
  });
  // プラグインを読み込む
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-uglify");
};
var MesaModel = /** @class */ (function () {
    function MesaModel() {
        // init
        this.editor = ace.edit("text-editor");
        this.tagListJson = [];
        this.addedTagListJson = [];
    }
    return MesaModel;
}());
var MesaView = /** @class */ (function () {
    function MesaView() {
    }
    MesaView.prototype.writeTextArea = function (text, model) {
        model.editor.session.setValue(text);
    };
    MesaView.prototype.makeTagButton = function (json) {
        var addElem = "";
        for (var _i = 0, json_1 = json; _i < json_1.length; _i++) {
            var tag = json_1[_i];
            if (tag.xmlFlag) {
                addElem += "<div class=\"func-btn xml-tag-btn\" val=\"" + tag.name + "\" style=\"cursor: pointer\">" + tag.name + "</div>";
            }
            else {
                addElem += "<div class=\"func-btn tag-btn\" val=\"" + (tag.sepChar + tag.name) + "\" style=\"cursor: pointer\">" + tag.name + "</div>";
            }
        }
        // add buttons
        $('#tags').append(addElem);
    };
    MesaView.prototype.hideAddedMsg = function () {
        $('#added-message').hide();
    };
    MesaView.prototype.showAddedMsg = function (tagInfoDic) {
        $('#added-message').append("");
        document.getElementById("added-message").innerText = tagInfoDic.name + " was added.";
        $('#added-message').show();
        $('#added-message').fadeOut(1500);
    };
    return MesaView;
}());
var MesaController = /** @class */ (function () {
    function MesaController() {
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
        //
        this.alertWhenReload();
        this.dragController();
    }
    MesaController.prototype.loadTextFile = function (model, view) {
        $('#upload-button').on('change', function (evt) {
            var file = evt.target.files;
            // make FileReader
            var reader = new FileReader();
            reader.readAsText(file[0]);
            // process after loading
            reader.onload = function () {
                view.writeTextArea(reader.result, model);
            };
        });
    };
    MesaController.prototype.loadJsonFile = function (model, view) {
        $('#load-tags-button').on('change', function (evt) {
            var file = evt.target.files;
            // make FileReader
            var reader = new FileReader();
            reader.readAsText(file[0]);
            // process after loading
            reader.onload = function () {
                // save json in model
                var json = JSON.parse(reader.result);
                if (json) {
                    model.tagListJson = json;
                }
                //
                view.makeTagButton(model.tagListJson);
            };
        });
    };
    MesaController.prototype.insertTag = function (model, view) {
        $('#tags').on('click', '.tag-btn', function () {
            var insertString = $(this).attr("val");
            var selections = model.editor.getSelection().getAllRanges();
            // insert all positions
            for (var _i = 0, selections_1 = selections; _i < selections_1.length; _i++) {
                var selection = selections_1[_i];
                if (selection.cursor) {
                    model.editor.session.insert(selection.cursor, insertString);
                }
                else {
                    model.editor.session.insert(selection.end, insertString);
                }
            }
        });
    };
    MesaController.prototype.insertXMLTag = function (model, view) {
        $('#tags').on('click', '.xml-tag-btn', function () {
            var selections = model.editor.getSelection().getAllRanges();
            var beginTag = "<" + $(this).attr("val") + ">";
            var endTag = "</" + $(this).attr("val") + ">";
            // insert all positions
            for (var _i = 0, selections_2 = selections; _i < selections_2.length; _i++) {
                var selection = selections_2[_i];
                // the order (endTag -> beginTag) is important
                // in the case: position.start = position.end
                model.editor.session.insert(selection.end, endTag);
                model.editor.session.insert(selection.start, beginTag);
            }
        });
    };
    MesaController.prototype.addTag = function (model, view) {
        $('#add-tag-btn').on('click', function () {
            var name = document.getElementById('tag-name-form').value || "name";
            var sepChar = document.getElementById('tag-sep-form').value || "\t";
            var xmlFlag = document.getElementById('xml-flag').checked;
            var newTag = {
                "name": name,
                "sepChar": sepChar,
                "xmlFlag": xmlFlag
            };
            // save tags added by user in model
            model.addedTagListJson.push(newTag);
            view.makeTagButton([newTag]);
            view.showAddedMsg(newTag);
        });
    };
    MesaController.prototype.downloadText = function (model, view) {
        // download text file
        document.querySelector('#text-donwload')
            .addEventListener('click', function (e) {
            // url
            e.target.href = URL.createObjectURL(new Blob([model.editor.session.getValue()], {
                type: "text/plain"
            }));
            // filename
            var filename = $('#download-filename').val() || "mesa_file.txt";
            e.target.download = filename;
        });
    };
    MesaController.prototype.downloadJson = function (model, view) {
        //download json file
        document.querySelector('#json-donwload')
            .addEventListener('click', function (e) {
            // url
            e.target.href = URL.createObjectURL(new Blob([JSON.stringify(model.tagListJson.concat(model.addedTagListJson), null, 2)], {
                type: "text/plain"
            }));
            // filename
            var filename = $('#download-jsonname').val() || "mesa_tags";
            e.target.download = filename + ".json";
        });
    };
    MesaController.prototype.alertWhenReload = function () {
        $(window).on('beforeunload', function (e) {
            var msg = "Data will be lost if you leave the page, are you sure?";
            return msg;
        });
    };
    MesaController.prototype.dragController = function () {
        // (source: https://q-az.net/elements-drag-and-drop/)
        var x;
        var y;
        var element = $("#tags")[0];
        element.addEventListener("dragstart", mdown);
        // when mouce click
        function mdown() {
            // add .drag to the class
            this.classList.add("drag");
            // get the position of the element
            x = event.pageX - this.offsetLeft;
            y = event.pageY - this.offsetTop;
            // callback move events
            document.body.addEventListener("mousemove", mmove, false);
            // document.body.addEventListener("touchmove", mmove, false);
        }
        // when mouse move
        function mmove() {
            var drag = document.getElementsByClassName("drag")[0];
            // move the element
            drag.style.top = event.pageY - y + "px";
            drag.style.left = event.pageX - x + "px";
            // when mouse or cursor over
            drag.addEventListener("mouseup", mup, false);
            document.body.addEventListener("mouseleave", mup, false);
            // drag.addEventListener("touchend", mup, false);
            // document.body.addEventListener("touchleave", mup, false);
        }
        // when mouse up
        function mup() {
            var drag = document.getElementsByClassName("drag")[0];
            // remove move event handlers
            document.body.removeEventListener("mousemove", mmove, false);
            // document.body.removeEventListener("touchmove", mmove, false);
            if (drag != null) {
                drag.removeEventListener("mouseup", mup, false);
                // drag.removeEventListener("touchend", mup, false);
                // remove class .drag
                drag.classList.remove("drag");
            }
        }
    };
    return MesaController;
}());
$(document).ready(function () {
    var editor = ace.edit("text-editor");
    editor.setTheme("ace/theme/monokai");
    editor.setFontSize(14);
    editor.getSession().setUseWrapMode(true); // 折り返し有効
    editor.getSession().setMode("ace/mode/html");
});
/**
 * @fileoverview MesaControllerクラスのインスタンスを生成する。
 * MesaModel.ts, MesaView.ts, MesaController.tsに依存するので
 * これらと一緒にコンパイルする必要がある。
 * @author 9sako6
 */
$(document).ready(function () {
    new MesaController();
});

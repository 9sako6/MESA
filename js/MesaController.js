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
    //
    this.alertWhenReload();
    this.dragController();
  }

  loadTextFile(model, view) {
    $('#upload-button').on('change', function(evt) {
      var file = evt.target.files;
      // make FileReader
      var reader = new FileReader();
      reader.readAsText(file[0]);
      // process after loading
      reader.onload = function() {
        view.writeTextArea(reader.result, model);
      }
    });
  }

  loadJsonFile(model, view) {
    $('#load-tags-button').on('change', function(evt) {
      var file = evt.target.files;
      // make FileReader
      var reader = new FileReader();
      reader.readAsText(file[0]);
      // process after loading
      reader.onload = function() {
        // save json in model
        var json = JSON.parse(reader.result)
        if (json) {
          model.tagListJson = json;
        }
        //
        view.makeTagButton(model.tagListJson);
      }
    });
  }

  insertTag(model, view) {
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
      // save tags added by user in model
      model.addedTagListJson.push(newTag);
      view.makeTagButton([newTag]);
      view.showAddedMsg(newTag);
    });
  }

  downloadText(model, view) {
    // download text file
    document.querySelector('#text-donwload')
      .addEventListener('click', (e) => {
        // url
        e.target.href = URL.createObjectURL(
          new Blob([model.editor.session.getValue()], {
            type: "text/plain"
          })
        )
        // filename
        var filename = $('#download-filename').val() || "mesa_file.txt";
        e.target.download = filename;
      })
  }

  downloadJson(model, view) {
    //download json file
    document.querySelector('#json-donwload')
      .addEventListener('click', (e) => {
        // url
        e.target.href = URL.createObjectURL(new Blob([JSON.stringify(model.tagListJson.concat(model.addedTagListJson), null, 2)], {
          type: "text/plain"
        }))
        // filename
        var filename = $('#download-jsonname').val() || "mesa_tags";
        e.target.download = filename + ".json";
      })
  }

  alertWhenReload() {
    $(window).on('beforeunload', function(e) {
      var msg = "Data will be lost if you leave the page, are you sure?";
      return msg;
    });
  }

  dragController() {
    // (source: https://q-az.net/elements-drag-and-drop/)

    var x;
    var y;
    var element = $("#tags")[0];

    element.addEventListener("dragstart", mdown);

    // when mouce click
    function mdown(e) {
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
    function mmove(e) {
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
    function mup(e) {
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
  }
}

/// <reference path="./MesaModel.ts" />
/// <reference path="./MesaView.ts" />

class MesaController {
  model: MesaModel;
  view: MesaView;
  constructor() {
    // init
    this.model = new MesaModel();
    this.view = new MesaView();
    this.view.initUploadButton();
    this.view.initSaveButton();
    this.view.initTagUploadButton();
    this.view.initTagSaveButton();
    this.view.initTagSettingArea();
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

  loadTextFile(model: MesaModel, view: MesaView): void {
    const _this = this;
    $('#upload-button').on('change', function (evt) {
      const elem: HTMLInputElement = <HTMLInputElement>evt.target;
      const fileList: FileList = elem.files!;
      // make FileReader
      const reader = new FileReader();
      reader.readAsText(fileList[0]);
      // process after loading
      reader.onload = function () {
        view.writeTextArea(_this.insertXmlDeclaration(String(reader.result)), model);
      }
      $('#file-name').text(fileList[0].name);
    });
  }

  loadJsonFile(model: MesaModel, view: MesaView): void {
    $('#load-tags-button').on('change', function (evt) {
      const elem: HTMLInputElement = <HTMLInputElement>evt.target;
      const fileList: FileList = elem.files!;
      // make FileReader
      const reader = new FileReader();
      reader.readAsText(fileList[0]);
      // process after loading
      reader.onload = function () {
        // save json in model
        let json = JSON.parse(String(reader.result));
        if (json) {
          model.tagListJson = json;
        }
        //
        view.makeTagButton(model.tagListJson);
      }
      $('#tag-file-name').text(fileList[0].name);
    });
  }

  insertXmlDeclaration(text: string): string {
    const reDeclaration: RegExp = /<\?xml[^>]+>/;
    return reDeclaration.test(text) ? text : `<?xml version="1.0" encoding="UTF-8" ?>\n${text}`;
  }

  insertTag(model: MesaModel, view: MesaView): void {
    $('#tags').on('click', '.tag-btn', function () {
      let insertString = $(this).attr("val")!;
      let selections = model.editor.getSelection().getAllRanges();
      // insert all positions
      for (let selection of selections) {
        model.editor.session.insert(selection.end, insertString);
      }
    });
  }

  insertXMLTag(model: MesaModel, view: MesaView): void {
    $('#tags').on('click', '.xml-tag-btn', function () {
      const selections: AceAjax.Range[] = model.editor.getSelection().getAllRanges();
      const beginTag: string = `<${$(this).attr("val")}>`;
      const endTag: string = `</${$(this).attr("val")}>`;
      // insert all positions
      if (selections.length === 1) {
        // the order (endTag -> beginTag) is important
        // in the case: position.start = position.end
        model.editor.session.insert(selections[0].end, endTag);
        model.editor.session.insert(selections[0].start, beginTag);
      } else {
        for (let selection of selections) {
          model.editor.session.insert(selection.start, beginTag);
          model.editor.session.insert(selection.end, endTag);
        }
      }

    });
  }

  addTag(model: MesaModel, view: MesaView): void {
    $('#add-tag-btn').on('click', function () {
      const nameElem: HTMLInputElement = <HTMLInputElement>document.getElementById('tag-name-form');
      const name = nameElem.value || "name";
      const sepCharElem: HTMLInputElement = <HTMLInputElement>document.getElementById('tag-sep-form');
      const sepChar = sepCharElem.value || "\t";
      const xmlFlagElem: HTMLInputElement = <HTMLInputElement>document.getElementById('xml-flag');
      const xmlFlag = xmlFlagElem.checked!;
      const newTag = {
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

  downloadText(model: MesaModel, view: MesaView): void {
    // download text file
    $('#text-donwload').on('click', function (event) {
      // url
      interface JsonDownload extends HTMLElement {
        href: string,
        download: string
      };
      const elem = <JsonDownload>event.target;
      elem.href = URL.createObjectURL(
        new Blob([model.editor.session.getValue()], {
          type: "text/plain"
        })
      )
      // filename
      let filename: string;
      const gotValue = $('#download-filename').val();
      if ('string' === typeof gotValue) {
        filename = gotValue === '' ? "mesa_file.xml" : gotValue;
      } else {
        // if typeof gotValue: string[]
        filename = "mesa_file.xml";
      }
      elem.download = filename;
    })
  }

  downloadJson(model: MesaModel, view: MesaView): void {
    //download json file
    $('#json-donwload').on('click', function (event) {
      // url
      interface JsonDownload extends HTMLElement {
        href: string,
        download: string
      };
      const elem = <JsonDownload>event.target;
      elem.href = URL.createObjectURL(new Blob([JSON.stringify(model.tagListJson.concat(model.addedTagListJson), null, 2)], {
        type: "text/plain"
      }))
      // filename
      let filename = $('#download-jsonname').val() || "mesa_tags";
      elem.download = filename + ".json";
    })
  }

  alertWhenReload(): void {
    $(window).on('beforeunload', function (e) {
      let msg = "Data will be lost if you leave the page, are you sure?";
      return msg;
    });
  }

  dragController(): void {
    // (source: https://q-az.net/elements-drag-and-drop/)
    let x: number;
    let y: number;
    let element = $("#tags")[0];

    element.addEventListener("dragstart", mdown);

    // when mouce click
    function mdown(event: MouseEvent): void {
      // add .drag to the class
      const elem = <HTMLElement>event.target;
      elem!.classList.add("drag");
      // get the position of the element
      x = event.pageX - elem!.offsetLeft;
      y = event.pageY - elem!.offsetTop;
      // callback move events
      document.body.addEventListener("mousemove", mmove, false);
    }

    // when mouse move
    function mmove(event: MouseEvent): void {
      const drag: HTMLInputElement = <HTMLInputElement>document.getElementsByClassName("drag")[0];
      // move the element
      drag.style.top = event.pageY - y + "px";
      drag.style.left = event.pageX - x + "px";
      // when mouse or cursor over
      drag.addEventListener("mouseup", mup, false);
      document.body.addEventListener("mouseleave", mup, false);
    }

    // when mouse up
    function mup(): void {
      let drag = document.getElementsByClassName("drag")[0];
      // remove move event handlers
      document.body.removeEventListener("mousemove", mmove, false);
      if (drag != null) {
        drag.removeEventListener("mouseup", mup, false);
        drag.classList.remove("drag");
      }
    }
  }
}

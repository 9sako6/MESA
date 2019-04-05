/// <reference path="./MesaModel.ts" />

class MesaView {
  writeTextArea(text: string, model: MesaModel) {
    model.editor.session.setValue(text);
  }

  initUploadButton() {
    const button: string = `
    <form>
    <label class="func-btn" for="upload-button" style="cursor: pointer">
      Open
      <input type="file" id="upload-button" style="display:none;">
    </label>
    <span class="file-info" id="file-name"></span>
    </form>`;
    $('#upload-button').replaceWith(button);
  }

  initSaveButton() {
    const button: string = `
    <table>
    <tr>
      <td>
        <div class="func-btn" style="cursor: pointer"><a id="text-donwload" download="mesa_file.txt" href="#">Save</a></div>
      </td>
      <td>
        <input type='text' id="download-filename" placeholder="Enter a file name">
      </td>
    </tr>
    </table>`;
    $('#save-button').replaceWith(button);
  }

  initTagUploadButton() {
    const button: string = `
    <form>
      <label class="func-btn" id="load-json" for="load-tags-button" style="cursor: pointer">
        Load Tags
        <input type="file" id="load-tags-button" style="display:none;">
      </label>
      <span class="file-info" id="tag-file-name"></span>
    </form>`;
    $('#tag-upload-button').replaceWith(button);
  }

  initTagSaveButton() {
    const button: string = `
    <div class="func-btn" style="cursor: pointer"><a id="json-donwload" download="mesa_tags.json" href="#">Save Tags</a></div>
    <input type='text' id="download-jsonname" placeholder="Enter a file name">
    <span class="file-info">.json</span>`;
    $('#tag-save-button').replaceWith(button);
  }

  initTagSettingArea() {
    const nameRow: string = `
    <td class="table-header">Name</td>
    <td><input type='text' id="tag-name-form" placeholder="Enter a tag name"></td>`;

    const sepRow: string = `
    <td class=" table-header">Separator</td>
    <td><input type='text' id="tag-sep-form" placeholder="If you need ..."></td>`;

    const isXmlRow: string = `
    <td class="table-header">XML Tag</td>
    <td>
      <input id="xml-flag" type="checkbox">
      <label for="xml-flag"></label>
    </td>`;

    const table: string = `
    <table id="tag-setting-table">
    <tr>
      ${nameRow}
    </tr>
    <tr>
      ${sepRow}
    </tr>
    <tr>
      ${isXmlRow}
    </tr>
    </table>`;
    $('#tag-setting-area').replaceWith(table);
  }

  makeTagButton(json) {
    let addElem: string = ""
    for (let tag of json) {
      if (tag.xmlFlag) {
        addElem += `<div class="func-btn xml-tag-btn" val="${tag.name}" style="cursor: pointer">${tag.name}</div>`;
      } else {
        addElem += `<div class="func-btn tag-btn" val="${tag.sepChar + tag.name}" style="cursor: pointer">${tag.name}</div>`;
      }
    }
    // add buttons
    $('#tags').append(addElem);
  }

  hideAddedMsg() {
    $('#added-message').hide();
  }

  showAddedMsg(tagInfoDic) {
    $('#added-message').append("")
    document.getElementById("added-message").innerText = `${tagInfoDic.name} was added.`;
    $('#added-message').show();
    $('#added-message').fadeOut(1500);
  }
}

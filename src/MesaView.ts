import $ from "jquery";
import MesaModel, { Attribute, Tag } from "./MesaModel";

export default class MesaView {
  writeTextArea(text: string, model: MesaModel): void {
    model.editor.session.setValue(text);
  }

  initUploadButton(): void {
    const button: string = `
    <form>
    <label class="func-btn" for="upload-button">
      Open
      <input type="file" id="upload-button" style="display:none;">
    </label>
    <span class="file-info" id="file-name"></span>
    </form>`;
    $("#upload-button").replaceWith(button);
  }

  initSaveButton(): void {
    const button: string = `
    <table>
    <tr>
      <td>
        <div class="func-btn"><a id="text-donwload" download="mesa_file.xml" href="#">Save</a></div>
      </td>
      <td>
        <input type='text' id="download-filename" placeholder="Enter a file name">
        <span class="file-info">.xml</span>
      </td>
    </tr>
    </table>`;
    $("#save-button").replaceWith(button);
  }

  initTagUploadButton(): void {
    const button: string = `
    <form>
      <label class="func-btn" id="load-json" for="load-tags-button">
        Load Tags
        <input type="file" id="load-tags-button" style="display:none;">
      </label>
      <span class="file-info" id="tag-file-name"></span>
    </form>`;
    $("#tag-upload-button").replaceWith(button);
  }

  initTagSaveButton(): void {
    const button: string = `
    <div class="func-btn"><a id="json-donwload" download="mesa_tags.json" href="#">Save Tags</a></div>
    <input type='text' id="download-jsonname" placeholder="Enter a file name">
    <span class="file-info">.json</span>`;
    $("#tag-save-button").replaceWith(button);
  }

  initTagSettingTable(): void {
    const nameRow: string = `
    <td class="table-header">Name</td>
    <td><input type='text' id="tag-name-form" placeholder="Enter a tag name"></td>`;

    const sepRow: string = `
    <td class=" table-header">Separator</td>
    <td><input type='text' id="tag-sep-form" placeholder="If you need ..."></td>`;

    const isXmlRow: string = `
    <td class="table-header">XML Tag?</td>
    <td>
      <input id="xml-flag" type="checkbox">
      <label for="xml-flag"></label>
    </td>`;

    const attributeRow: string = `
    <td><input type='text' class="attribute-name-form" placeholder="Enter a name"></td>
    <td><input type='text' class="attribute-value-form" placeholder="Enter a value"></td>`;

    const addAttributeButton: string = `<div class="func-btn" id="add-attribute">Add an attribute</div>`;

    const table: string = `
    <table class="tag-setting-table">
    <tr>
      ${isXmlRow}
    </tr>
    <tr>
    ${nameRow}
    </tr>
    <tr id="tag-separator">
      ${sepRow}
    </tr>
    <tr id="attributes-header">
      <td class="table-header">Attributes</td><td>${addAttributeButton}</td>
    </tr>
    </table>
    <table class="tag-setting-table" id="attributes-input">
    <tr>
    ${attributeRow}
    </tr>
    </table>`;
    $("#tag-setting-table").html(table);
  }

  makeTagButton(tagList: Tag[]): void {
    let addElem: string = "";
    for (let tag of tagList) {
      if (tag.xmlFlag) {
        // get attributes
        let attributes: string = "";
        if (tag.attributes !== undefined) {
          tag.attributes.forEach(function(attr: Attribute) {
            attributes += `${attr.name}__MESA_ATTRIBUTE_SEPARATOR__${attr.value},`; // __MESA_ATTRIBUTE_SEPARATOR__ and comma is neccessary
          });
        }
        // make tag
        addElem += `<div class="func-btn xml-tag-btn" val="${tag.name}" attributes="${attributes}">${tag.name}</div>`;
      } else {
        addElem += `<div class="func-btn tag-btn" val="${tag.sepChar +
          tag.name}">${tag.name}</div>`;
      }
    }
    // add buttons
    $("#tags").append(addElem);
  }

  hideAddedMsg(): void {
    $("#added-message").hide();
  }

  showAddedMsg(tagInfoDic: Tag): void {
    $("#added-message").append("");
    document.getElementById(
      "added-message"
    )!.innerText = `${tagInfoDic.name} was added.`;
    $("#added-message").show();
    $("#added-message").fadeOut(1500);
  }

  addAttributesInput(): void {
    const attributeRow: string = `
    <td><input type='text' id="attribute-name-form" placeholder="Enter a name"></td>
    <td><input type='text' id="attribute-value-form" placeholder="Enter a value"></td>`;
    $("#attributes-input").append(`<tr>${attributeRow}</tr>`);
  }
}

class MesaView {
  writeTextArea(text: string, model: MesaModel) {
    model.editor.session.setValue(text);
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

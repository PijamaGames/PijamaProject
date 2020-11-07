class ScrollBox extends TextBox{
  constructor(id, text, scale, centered = false){
    super(id, text, scale, centered);
    this.isInputField = true;

  }

  CreateElement(){
    this.element = document.createElement("div");

    if(this.id != null){
      this.element.id = this.id;
    }
    this.element.className +=  "game_scrollBox";
    var parent = document.getElementById("UI");
    parent.appendChild(this.element);
  }

  SetText(text){
    if(this.id != null){
      this.element.id = this.id;
      var inputField = document.getElementById(this.id);
      inputField.value=text;
    }
    return this;
  }
}

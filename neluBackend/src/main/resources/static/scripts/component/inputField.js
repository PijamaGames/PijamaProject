class InputField extends TextBox2{
  constructor(id, text, scale, centered = false){
    super(id, text, scale, centered);
    this.isInputField = true;

  }

  CreateElement(){
    this.element = document.createElement("INPUT");
    this.element.setAttribute("type", "text");
    this.element.className +=  "game_input";
    if(this.centered){
      this.element.style.textAlign = "center";
    }
    var text = document.createTextNode(this.text);
    this.element.appendChild(text);

    var parent = document.getElementById("UI");
    parent.appendChild(this.element);

    if(this.id != null){
      this.element.id = this.id;
    }
  }

  SetText(text){
    this.text = text;
    this.element.value = text;
    return this;
  }
}

class ScrollButtton extends TextBox{
  constructor(id, text, scale, centered = false){
    super(id, text, scale, centered);

  }

  CreateElement(){
    this.element = document.createElement("div");
    this.element.className +=  "game_scrollBox";
    var parent = document.getElementById("UI");
    parent.appendChild(this.element);

    for (var room of publicRooms){
      var button = document.createElement("input");
      button.type = "button";
      button.value = room;
      button.onclick = this.OnClick;
      this.element.appendChild(button);
    }
  }

  OnClick(){
    Log("holi");
  }
}

class ScrollButton extends TextBox{
  constructor(id, text,t, scale, centered = false){
    super(id, text,t, scale, centered);

  }

  CreateElement(){

    this.element = document.createElement("div");
    if(this.id!=null){
      this.element.id=this.id;
    }

    this.element.className +=  "game_scrollBox";
    var parent = document.getElementById("UI");
    parent.appendChild(this.element);

  }


}

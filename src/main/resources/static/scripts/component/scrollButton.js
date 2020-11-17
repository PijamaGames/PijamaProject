class ScrollButton extends TextBox{
  constructor(id, text,t, scale, centered = false){
    super(id, text,t, scale, centered);

  }

  CreateElement(){

    this.element = document.createElement("div");
    if(this.id!=null){
      this.element.id=this.id;
    }
    if(this.centered){
      this.element.style.textAlign = "center";
    }

    this.element.className +=  "game_scrollBox";
    var parent = document.getElementById("UI");
    parent.appendChild(this.element);

  }


}

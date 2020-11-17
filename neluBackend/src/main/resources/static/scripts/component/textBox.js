class TextBox extends Component{
  constructor(id, spanishText, englishText, scale, centered,change=true){
    super();
    this.type = "textBox";
    this.element = null;
    this.textSp = spanishText;
    this.textEn = englishText;
    this.scale=scale;
    this.centered=centered;
    this.isInputField=false;
    this.id = id;
    this.change=change;
  }

  ChangeTextLanguage(){
    this.element.innerHTML=manager.english? this.textEn: this.textSp;
  }

  OnSetActive(active){
    this.element.hidden = !active;
  }

  Destroy(){
    this.element.parentNode.removeChild(this.element);
    this.gameobj.scene.domElements.delete(this);
    if(this.change) this.listener.Remove();
  }

  Update(){
    //if(manager.scene.camera.camera.fading){
      this.element.style.opacity = manager.scene.camera.camera.brightness/manager.scene.camera.camera.maxBrightness;
    //}

    this.ElementResponsive();
  }

  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.textBox = this;

    this.CreateElement();
    this.gameobj.scene.domElements.add(this);
    var that=this;
    if(this.change) this.listener=manager.changeLanguageEvent.AddListener(this,()=>that.ChangeTextLanguage());
    this.ElementResponsive();
    //this.ChangeTextLanguage();
  }

  CreateElement(){
    this.element = document.createElement("p");
    this.element.className +=  "game_text";
    if(this.centered){
      this.element.style.textAlign = "center";
    }
    var text = manager.english? document.createTextNode(this.textEn) : document.createTextNode(this.textSp);
    this.element.appendChild(text);

    var parent = document.getElementById("UI");
    parent.appendChild(this.element);

    if(this.id != null){
      this.element.id = this.id;
    }
  }

  SetText(text){
    this.text = text;
    this.element.innerHTML = text;
    return this;
  }



  ElementResponsive(){
    /*const fontSize = 5;
    this.element.style.fontSize = "" + fontSize + "vmin";*/

    let width = this.scale.x*100;
    let height = this.scale.y*100;

    this.element.style.width = width + "vmin";
    this.element.style.height = height + "vmin";

    let pos = this.gameobj.transform.GetWorldPos();
    let anchor = this.gameobj.transform.anchor;
    let aspectRatio = Math.max((window.innerWidth/window.innerHeight),1);
    let gameResX = Math.min(manager.graphics.res.x, canvas.width);
    let gameAspectRatio = gameResX/manager.graphics.res.y;

    let leftDisplacement = ((1.0-(gameResX/canvas.width))*0.5)*aspectRatio;
    this.element.style.left = "" + (pos.x+anchor.x*gameAspectRatio+leftDisplacement)*100-(width*0.5) - (this.isInputField ? 4.0 : 0.0) +"vmin";

    this.element.style.top = "" + (-pos.y+1.0-anchor.y)*100 - (height*0.5) + "vmin";
  }
}

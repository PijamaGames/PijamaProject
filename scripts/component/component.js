class Component{
  constructor(){
    this.type = "baseComponent";
    this.gameobj = null;
  }

  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.baseComponent = this;
  }

  Update(){

  }

  Destroy(){

  }
}

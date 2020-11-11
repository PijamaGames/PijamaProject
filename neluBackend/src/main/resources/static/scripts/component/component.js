class Component{
  constructor(){
    this.type = "baseComponent";
    this.gameobj = null;
  }

  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.baseComponent = this;
  }

  get active(){
    return this.gameobj.active;
  }

  OnSetActive(active){

  }

  OnCreate(){

  }

  SetScene(scene){

  }

  Update(){

  }

  Destroy(){

  }
}

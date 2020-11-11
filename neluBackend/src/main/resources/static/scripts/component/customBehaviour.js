class CustomBehaviour extends Component{
  constructor(){
    super();
    this.type = "CustomBehaviour";
  }

  Destroy(){
    if(this.onDestroy) this.onDestroy(this.gameobj);
  }

  OnSetActive(active){
    if(active){
      if(this.onEnable) this.onEnable(this.gameobj);
    } else {
      if(this.onDisable) this.onDisable(this.gameobj);
    }
  }
  Update(){
    if(this.onUpdate)
      this.onUpdate(this.gameobj);
  }
  SetOnCreate(onCreate){
    this.onCreate = onCreate;
    return this;
  }
  SetOnUpdate(onUpdate){
    this.onUpdate=onUpdate;
    return this;
  }
  SetOnEnable(onEnable){
    this.onEnable=onEnable;
    return this;
  }
  SetOnDisable(onDisable){
    this.onDisable = onDisable;
    return this;
  }

  SetOnDestroy(onDestroy){
    this.onDestroy=onDestroy;
    return this;
  }

  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.customBehaviour = this;
  }

  OnCreate(){
    if(this.onCreate) this.onCreate(this.gameobj);
  }
}

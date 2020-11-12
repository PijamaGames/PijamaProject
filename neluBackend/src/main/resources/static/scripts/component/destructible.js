class Destructible extends Component{
  constructor(){
    super();
    this.onDestruct = function(){};
  }

  SetOnDestruct(func){
    this.onDestruct = func;
    return this;
  }

  Destruct(){
    this.onDestruct(this.gameobj);
    this.gameobj.Destroy();
  }

  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.destructible = this;
  }
}

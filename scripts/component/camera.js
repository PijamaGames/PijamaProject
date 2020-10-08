class Camera extends Component{
  constructor(){
    super();
    this.type="camera";
  }

  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.camera = this;
  }
}

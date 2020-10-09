class Rigidbody extends Component{
  constructor(){
    super();
    this.type="rigidbody";
  }
  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.rigidbody = this;
  }
}

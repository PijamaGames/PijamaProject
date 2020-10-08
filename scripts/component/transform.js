class Transform extends Component{
  constructor(){
    super();
    this.type = "transform";
    this.position = new Vec2();
    this.scale = new Vec2(1,1);
  }

  get worldPos(){
    if(!this.gameobj.parent){
      return this.position;
    }
    else{
      let parentPos = this.gameobj.parent.transform.worldPos;
      return Vec2.Add(parentPos, this.position);
    }
  }

  set worldPos(pos){
    this.position = Vec2.Add(this.position, Vec2.Sub(pos,this.worldPos));
  }

  Rotate(rad, displacement = new Vec2()){
    this.position.RotAround(rad, displacement);
  }

  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.transform = this;
  }
}

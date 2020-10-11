class Transform extends Component{
  constructor(position = new Vec2(), height = 0.0, scale = new Vec2(1,1), anchor = new Vec2(0.5,0.5)){
    super();
    Object.assign(this, {position, height, scale, anchor});
    this.type = "transform";
    //this.position = new Vec2();
    //this.height = 0.0;
    //this.scale = new Vec2(1,1);
    //this.anchor = new Vec2(0.5,0.5);
  }

  get floorPos(){
    return (this.GetWorldPosPerfect().y-this.scale.y*this.anchor.y-
    manager.scene.camera.transform.position.y);
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

  //For callbacks
  GetWorldPos(){
    return worldPos;
  }

  GetWorldPosPerfect(){
    let wp = this.worldPos;
    return new Vec2(
      Math.round(wp.x*tileSize)/tileSize,
      Math.round(wp.y*tileSize)/tileSize
    )
  }

  GetAnchor(){
    return this.anchor;
  }

  Rotate(rad, displacement = new Vec2()){
    this.position.RotAround(rad, displacement);
  }

  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.transform = this;
  }
}

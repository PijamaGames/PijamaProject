class Transform extends Component {
  constructor(position = new Vec2(), height = 0.0, scale = new Vec2(1, 1), anchor = new Vec2(0.5, 0.5)) {
    super();
    Object.assign(this, {
      position,
      height,
      scale,
      anchor
    });
    this.type = "transform";
    //this.position = new Vec2();
    //this.height = 0.0;
    //this.scale = new Vec2(1,1);
    //this.anchor = new Vec2(0.5,0.5);
  }

  get floorPos() {
    return (this.GetWorldPosPerfect().y - this.scale.y * this.anchor.y -
      manager.scene.camera.transform.position.y);
  }

  get worldPos() {
    if (!this.gameobj.parent) {
      return this.position.Copy();
    } else {
      let parentPos = this.gameobj.parent.transform.worldPos;
      return Vec2.Add(parentPos, this.position);
    }
  }

  set worldPos(pos) {
    this.position = Vec2.Add(this.position, Vec2.Sub(pos, this.worldPos));
  }

  //For callbacks
  GetWorldPos() {
    return this.worldPos;
  }

  GetWorldPosPerfect() {
    let wp = this.worldPos;
    return new Vec2(
      Math.round(wp.x * tileSize) / tileSize,
      Math.round(wp.y * tileSize) / tileSize
    )
  }

  GetWorldCenter() {
    let worldPos = this.worldPos;
    worldPos.Set(
      worldPos.x + (-this.anchor.x + 0.5) * this.scale.x,
      worldPos.y + (-this.anchor.y + 0.5) * this.scale.y
    )
    return worldPos;
  }
  SetWorldCenter(position){
    let dif = this.GetWorldCenter().Sub(this.worldPos);
    this.position.Set(
      position.x - dif.x,
      position.y - dif.y
    )
    //this.position.Add(dif);
  }

  Distance(position) {
    return Vec2.Distance(this.GetWorldCenter(), position);
  }

  GetAnchor() {
    return this.anchor;
  }

  IsInsideBoundaries(position) {

    let worldPos = this.worldPos;

    worldPos.Set(
      worldPos.x - this.anchor.x * this.scale.x,
      worldPos.y - this.anchor.y * this.scale.y
    );

    return position.x > worldPos.x && position.x < worldPos.x + this.scale.x && //inside x
      position.y > worldPos.y && position.y < worldPos.y + this.scale.y;        //inside y
  }

  Rotate(rad, displacement = new Vec2()) {
    this.position.RotAround(rad, displacement);
  }

  SetGameobj(gameobj) {
    this.gameobj = gameobj;
    this.gameobj.transform = this;
  }
}

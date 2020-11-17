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
    this.lastWorldPos = new Vec2();
    this.lastWorldCenter = new Vec2();
    this.positionChangedFlag = true;
    this.centerChangedFlag = true;
  }

  ChangeFlags(){
    this.positionChangedFlag = true;
    this.centerChangedFlag = true;
    for(let [key, value] of this.gameobj.children){
      if(value.transform){
        value.transform.ChangeFlags();
      }
    }
  }

  GetLocalPosition(){
    return this.position;
  }
  SetLocalPosition(pos){
    this.position.Set(pos.x, pos.y);
    this.ChangeFlags();
  }

  //For callbacks
  GetWorldPos() {

    if(!this.positionChangedFlag){
      return this.lastWorldPos;
    } else {

      this.positionChangedFlag = false;
      if (!this.gameobj.parent) {
        let wp = this.position.Copy();
        this.lastWorldPos = wp;
        return wp;
      } else {
        let parentPos = this.gameobj.parent.transform.GetWorldPos();
        let wp = Vec2.Add(parentPos, this.position);
        this.lastWorldPos = wp;
        return wp;
      }
    }
  }

  GetWorldPosPerfect() {
    let wp = this.GetWorldPos();
    return new Vec2(
      Math.round(wp.x * tileSize) / tileSize,
      Math.round(wp.y * tileSize) / tileSize
    )
  }

  SetWorldPosition(pos){
    if(!pos.Equals(this.lastWorldPos)){
      this.position = Vec2.Add(this.position, Vec2.Sub(pos, this.GetWorldPos()));
      this.ChangeFlags();
    }
  }

  GetWorldCenter() {
    if(!this.centerChangedFlag){
      return this.lastWorldCenter;
    } else {
      this.centerChangedFlag = false;
      let worldPos = this.GetWorldPos().Copy();
      worldPos.Set(
        worldPos.x + (-this.anchor.x + 0.5) * this.scale.x,
        worldPos.y + (-this.anchor.y + 0.5) * this.scale.y
      )
      this.lastWorldCenter = worldPos;
      return worldPos;
    }
  }

  GetWorldFloor(){
    let center = this.GetWorldCenter().Copy();
    center.y = center.y - this.scale.y*0.5;
    return center;
  }

  GetWorldCenterPerfect(){
    let wc = this.GetWorldCenter();
    return new Vec2(
      Math.round(wc.x * tileSize) / tileSize,
      Math.round(wc.y * tileSize) / tileSize
    )
  }
  SetWorldCenter(position){
    if(!position.Equals(this.lastWorldCenter)){
      let dif = this.GetWorldCenter().Copy().Sub(this.GetWorldPos());
      this.position.Set(
        position.x - dif.x,
        position.y - dif.y
      );
      this.ChangeFlags();
    }
    //this.position.Add(dif);
  }

  Distance(position) {
    return Vec2.Distance(this.GetWorldCenter(), position);
  }

  GetAnchor() {
    return this.anchor;
  }

  IsInsideBoundaries(position) {

    let worldPos = this.GetWorldPos().Copy();

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

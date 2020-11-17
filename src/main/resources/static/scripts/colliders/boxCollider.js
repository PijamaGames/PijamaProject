class BoxCollider extends Collider{
  constructor(displacement = new Vec2(),width = 1.0, height = 1.0, isTrigger=false, onTriggerEnterCallback, onTriggerStayCallback,onTriggerExitCallback){
    super(displacement,isTrigger, onTriggerEnterCallback, onTriggerStayCallback,onTriggerExitCallback);
    Object.assign(this,{height,width});
    this.type="boxCollider";
    this.scale = new Vec2(width, height);
  }

  GetProjection(center){
    let corners = [this.leftUpCorner, this.rightUpCorner, this.leftDownCorner, this.rightDownCorner];
    let projections = [ //up, down, left, right
      Vec2.ProjectOnRect(center, corners[0], corners[1], true),
      Vec2.ProjectOnRect(center, corners[2], corners[3], true),
      Vec2.ProjectOnRect(center, corners[2], corners[0], true),
      Vec2.ProjectOnRect(center, corners[3], corners[1], true)
    ];

    //nearestPoint is the projection point that has the minimum distance to the center of the circle

    let distances = [
      Vec2.Sub(center, projections[0]).mod,
      Vec2.Sub(center, projections[1]).mod,
      Vec2.Sub(center, projections[2]).mod,
      Vec2.Sub(center, projections[3]).mod
    ];


    //minDist = Math.min(distD, distL, distR, distU);
    let minDist = distances[0];
    let closest = projections[0];
    for(var i = 1; i < 4; i++){
      if(distances[i] < minDist){
        minDist = distances[i];
        closest = projections[i];
      }
    }
    return [minDist, closest];
  }

  get leftUpCorner(){
    return new Vec2(this.leftPos.x,this.upPos.y);
  }
  get leftDownCorner(){
    return new Vec2(this.leftPos.x,this.downPos.y);
  }
  get rightUpCorner(){
    return new Vec2(this.rightPos.x,this.upPos.y);
  }
  get rightDownCorner(){
    return new Vec2(this.rightPos.x,this.downPos.y);
  }

  get vertDisplacement(){
    let pos = this.worldCenter;
    let h = this.colliderGroup.gameobj.transform.height;
    return new Vec2(
      (pos.x/this.width-0.5)*2.0+1.0,
      ((pos.y)/this.height-0.5)*2.0+1.0
    )
  }

  GetSides(){
    let wp = this.worldCenter;
    let left = wp.x-(this.width/2.0);
    let right = wp.x+(this.width/2.0);
    let up = wp.y+(this.height/2.0);
    let down = wp.y-(this.height/2.0);
    return [left, right, up, down]
  }

  get leftPos(){
    let wp = this.worldCenter;
    return new Vec2(wp.x-(this.width/2.0),wp.y);
  }

  get rightPos(){
    let wp = this.worldCenter;
    return new Vec2(wp.x+(this.width/2.0),wp.y);
  }

  get upPos(){
    let wp = this.worldCenter;
    return new Vec2(wp.x,wp.y+(this.height/2.0));
  }

  get downPos(){
    let wp = this.worldCenter;
    return new Vec2(wp.x,wp.y-(this.height/2.0));
  }

}

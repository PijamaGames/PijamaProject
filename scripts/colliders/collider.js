class Collider {
  constructor(displacement,isTrigger, onTriggerEnterCallback, onTriggerStayCallback,onTriggerExitCallback) {
    this.type = "collider";
    this.tint = new Float32Array([0.0, 1.0, 0.0, 0.5]);
    Object.assign(this, {displacement, isTrigger});
    this.OnTriggerEnterCallback=onTriggerEnterCallback;
    this.OnTriggerStayCallback=onTriggerStayCallback;
    this.OnTriggerExitCallback=onTriggerExitCallback;
    this.circular = 0.0;
    this.isColliding;
    this.objsInsideTrigger=new Map();
  }

  get active(){
    return this.colliderGroup.active;
  }

  SetTint(r=1.0,g=1.0,b=1.0,a=1.0){
    this.tint[0] = r;
    this.tint[1] = g;
    this.tint[2] = b;
    this.tint[3] = a;
  }

  get isCircular() {
    return this.circular === 1.0;
  }
  get worldCenter() {
    return this.colliderGroup.gameobj.transform.GetWorldCenterPerfect().Copy().Add(this.displacement);
  }
  get gameobj() {
    return this.colliderGroup.gameobj;
  }

  CheckTrigger(c2){
    let c1Key=this.gameobj.key;
    let c2Key=c2.gameobj.key;

    if(this.isColliding) {
      if(this.isTrigger && !this.objsInsideTrigger.has(c2Key)){
        this.objsInsideTrigger.set(c2Key,c2);
        this.OnTriggerEnter(c2.gameobj);
      }
      else if(this.isTrigger && this.objsInsideTrigger.has(c2Key)){
        this.OnTriggerStay(c2.gameobj);
      }
    }
    else{
      if(this.isTrigger && this.objsInsideTrigger.has(c2Key)){
        this.OnTriggerExit(c2.gameobj);
        this.objsInsideTrigger.delete(c2Key);
      }
    }

  }

  CheckCollision(c2){
    let dir;
    if(this.isCircular && c2.isCircular){           //Circular collision
      dir = this.CirclesCollision(c2);
    } else if(!this.isCircular && !c2.isCircular){  //Box collision
      dir = this.BoxesCollision(c2);
    } else {                                        //Circular-Box Collision
      dir = this.BoxCircleCollision(c2);
    }
    if(!dir) dir = new Vec2();

    this.isColliding=dir.mod > 0.0;
    c2.isColliding=this.isColliding;

    return dir;
  }

  OnTriggerEnter(obj){
    this.OnTriggerEnterCallback(obj);
  }

  OnTriggerStay(obj){
    this.OnTriggerStayCallback(obj);
  }

  OnTriggerExit(obj){
    this.OnTriggerExitCallback(obj);
  }

  CirclesCollision(c2) {
    let dir = this.worldCenter.Sub(c2.worldCenter);
    let dist = dir.mod;
    let sumRadius = this.radius + c2.radius;
    let penetration = sumRadius - dist;
    if(penetration < 0.0) penetration = 0.0;
    return dir.Norm().Scale(penetration);
  }

  BoxCircleCollision(c2) {
    let circle;
    let box;
    let penetration=0.0;
    if(c2.isCircular){
      circle = c2;
      box = this;
    } else {
      circle = this;
      box = c2;
    }

    let circleCenter = circle.worldCenter;

    let [left, right, up, down] = box.GetSides();
    let inside = circleCenter.x >= left && circleCenter.x <= right && circleCenter.y <= up && circleCenter.y >= down;
    if(inside){
      let dir = box.worldCenter.Sub(circleCenter);
      return this == (circle ? dir.Opposite() : dir).Scale(0.1);
    }
    //let inside = circleCenter.x > sides

    let corners = [box.leftUpCorner, box.rightUpCorner, box.leftDownCorner, box.rightDownCorner];
    let projections = [ //up, down, left, right
      Vec2.ProjectOnRect(circleCenter, corners[0], corners[1], true),
      Vec2.ProjectOnRect(circleCenter, corners[2], corners[3], true),
      Vec2.ProjectOnRect(circleCenter, corners[2], corners[0], true),
      Vec2.ProjectOnRect(circleCenter, corners[3], corners[1], true)
    ];

    //nearestPoint is the projection point that has the minimum distance to the center of the circle

    let distances = [
      Vec2.Sub(circleCenter, projections[0]).mod,
      Vec2.Sub(circleCenter, projections[1]).mod,
      Vec2.Sub(circleCenter, projections[2]).mod,
      Vec2.Sub(circleCenter, projections[3]).mod
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

    let dir = Vec2.Sub(circleCenter, closest);
    if(minDist > circle.radius){
      return new Vec2();
    } else { //They are colliding
      penetration=circle.radius-minDist
      dir.Norm().Scale(penetration)
      if(this == circle){
        return dir;
      }
      else{
        return dir.Opposite();
      }

    }
  }

  BoxesCollision(c2) {
    let c1center = this.worldCenter;
    let c2center = c2.worldCenter;

    let sides = this.GetSides();
    let c1left = sides[0];
    let c1right = sides[1];
    let c1up = sides[2];
    let c1down = sides[3];

    sides = c2.GetSides();
    let c2left = sides[0];
    let c2right = sides[1];
    let c2up = sides[2];
    let c2down = sides[3];

    if(!(c1down > c2up || c1up < c2down || c1right < c2left || c1left > c2right)){
      let px = 0.0;
      let py = 0.0;

      let signX = c1center.x < c2center.x ? -1.0 : 1.0;
      let signY = c1center.y < c2center.y ? -1.0 : 1.0;


      if(c1center.x < c2center.x){ //c2 colliding by right side
        px = c1right - c2left;
      } else {
        px = c2right - c1left;
      }

      if(c1center.y < c2center.y){ //c2 colliding by up side
        py = c1up-c2down;
      } else {
        py = c2up - c1down;
      }

      var leftP = Math.abs(px) < Math.abs(py) ? 1.0 : 0.0;

      return new Vec2(px*signX*leftP, py*signY*(1.0-leftP));

    } else {
      return new Vec2();
    }
  }
}

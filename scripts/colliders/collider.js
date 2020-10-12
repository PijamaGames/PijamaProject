class Collider {
  constructor(displacement) {
    this.type = "collider";
    this.tint = new Float32Array([0.0, 1.0, 0.0, 0.5]);
    Object.assign(this, {
      displacement
    });
    this.circular = 0.0;
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
    return this.colliderGroup.gameobj.transform.GetWorldPosPerfect().Add(this.displacement);
  }
  get gameobj() {
    return this.colliderGroup.gameobj;
  }
  /*get position() {
    return this.gameobj.transform.position;
  }*/

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
    return dir;
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
    if(c2.isCircular){
      circle = c2;
      box = this;
    } else {
      circle = this;
      box = c2;
    }

    let circleCenter = circle.worldCenter;
    let projections = [ //up, down, left, right
      Vec2.ProjectOnRect(circleCenter, box.leftUpCorner, box.rightUpCorner, true),
      Vec2.ProjectOnRect(circleCenter, box.leftDownCorner, box.rightDownCorner, true),
      Vec2.ProjectOnRect(circleCenter, box.leftDownCorner, box.leftUpCorner, true),
      Vec2.ProjectOnRect(circleCenter, box.rightDownCorner, box.rightUpCorner, true)
    ];

    //nearestPoint is the projection point that has the minimum distance to the center of the circle

    let distances = [
      Vec2.Mod(Vec2.Sub(circleCenter, projections[0])),
      Vec2.Mod(Vec2.Sub(circleCenter, projections[1])),
      Vec2.Mod(Vec2.Sub(circleCenter, projections[2])),
      Vec2.Mod(Vec2.Sub(circleCenter, projections[3]))
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
      return dir.Norm().Scale(circle.radius-minDist);
    }
  }

  BoxesCollision(c2) {
    let c1center = this.worldCenter;
    let c2center = c2.worldCenter;

    let c1up = this.upPos.y;
    let c1down = this.downPos.y;
    let c1right = this.rightPos.x;
    let c1left = this.leftPos.x;

    let c2up = c2.upPos.y;
    let c2down = c2.downPos.y;
    let c2right = c2.rightPos.x;
    let c2left = c2.leftPos.x;

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

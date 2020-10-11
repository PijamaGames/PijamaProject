class Collider{
  constructor(){
    this.type = "collider";
  }

  CirclesCollision(collider,otherCollider){
    let dir=Vec2.Sub(otherCollider.position,collider.position);
    let dist=Vec2.Mod(v1v2);
    let sumRadius=collider.radius+otherCollider.radius;
    let penetration=sumRadius-dist;
    dir.Norm();
    return [dir,penetration];
    //return dist<=sumRadius;
  }

  BoxCircleCollision(collider,otherCollider){
    let dist;
    let dir=new Vec2();
    let penetration=0.0;
    if (collider.type='circleCollider'){
      dist=this.Projections(collider,otherCollider);
      penetration=collider.radius-dist;
      dir=Vec2.Sub(otherCollider.position,collider.position);
      dir.Norm();
      //return dist<=collider.radius;
    }
    else if(collider.type='boxCollider'){
      dist=this.Projections(otherCollider,collider);
      penetration=otherCollider.radius-dist;
      dir=Vec2.Sub(collider.position,otherCollider.position);
      dir.Norm();
      //return dist<=otherCollider.radius;
    }
    //devolver penetration y dir!!!!!!!!!!!!!
    //return false;
    return [dir,penetration];
  }

  Projections(circle,box){
    let minDist;
    let distancias=[];
    let projectionPointUp=Vec2.ProjectOnRect(circle.position,box.rightUpCorner,box.leftUpCorner);
    let projectionPointDown=Vec2.ProjectOnRect(circle.position,box.rightDownCorner,box.leftDownCorner);
    let projectionPointLeft=Vec2.ProjectOnRect(circle.position,box.leftDownCorner,box.leftUpCorner);
    let projectionPointRight=Vec2.ProjectOnRect(circle.position,box.rightDownCorner,box.rightUpCorner);

    //if the point go off the side of the plane, the projection point is the corner
    if(projectionPointUp.x>box.rightUpCorner.x) projectionPointUp.x=box.rightUpCorner.x;
    else if(projectionPointUp.x<box.leftUpCorner.x) projectionPointUp.x=box.leftUpCorner.x;

    if(projectionPointDown.x>box.rightDownCorner.x) projectionPointDown.x=box.rightDownCorner.x;
    else if(projectionPointDown.x<box.leftDownCorner.x) projectionPointDown.x=box.leftDownCorner.x;

    if(projectionPointLeft.y>box.leftUpCorner.y) projectionPointLeft.y=box.leftUpCorner.y;
    else if(projectionPointLeft.y<box.leftDownCorner.y) projectionPointLeft.y=box.leftDownCorner.y;

    if(projectionPointRight.y>box.rightUpCorner.y) projectionPointRight.y=box.rightUpCorner.y;
    else if(projectionPointRight.y<box.rightDownCorner.y) projectionPointRight.y=box.rightDownCorner.y;

    //nearestPoint is the projection point that has the minimum distance to the center of the circle
    let distD=Vec2.Mod(Vec2.Sub(circle.position,projectionPointDown));
    let distU=Vec2.Mod(Vec2.Sub(circle.position,projectionPointUp));
    let distR=Vec2.Mod(Vec2.Sub(circle.position,projectionPointRight));
    let distL=Vec2.Mod(Vec2.Sub(circle.position,projectionPointLeft));

    minDist=Math.min(distD,distL,distR,distU);

    return minDist;
  }

  BoxesCollision(collider,otherCollider){
    let contX=0;
    let contY=0;
    let penetration= new Vec2();
    let p;
    let dir=new Vec2();
    if (collider.downPos.y<=otherCollider.downPos.y && otherCollider.downPos.y<=collider.upPos.y){
      //Log("lado de arriba dentro");
      penetration.y=collider.upPos.y-otherCollider.downPos.y;
      contY++;
    }

    if (collider.downPos.y<=otherCollider.upPos.y && otherCollider.upPos.y<=collider.upPos.y){
      //Log("lado de abajo dentro");
      penetration.y=otherCollider.upPos.y-collider.downPos.y;
      contY++;
    }

    if(collider.leftPos.x<=otherCollider.rightPos.x && otherCollider.rightPos.x<=collider.rightPos.x){
      //Log("lado derecho dentro");
      penetration.x=otherCollider.rightPos.x-collider.leftPos.x;
      contX++;
    }

    if(collider.leftPos.x<=otherCollider.leftPos.x && otherCollider.leftPos.x<=collider.rightPos.x){
      //Log("lado izquierdo dentro");
      penetration.x=collider.rightPos.x-otherCollider.leftPos.x;
      contX++;
    }

    if(penetration.x>penetration.y){
      dir.Vec2.Set(1,0);
      p=penetration.x;
    }else {
      dir.Vec2.Set(0,1);
      p=penetration.y;
    }
    return [dir,p];
    //return contX>=1 && contY>=1;
  }
}

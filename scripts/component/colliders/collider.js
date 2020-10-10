class Collider{
  constructor(){
    this.type = "collider";
  }


  CirclesColision(collider,otherCollider){
    /*let distX=this.Distance(collider.position.x,otherCollider.position.x);
    let distY=this.Distance(collider.position.y,otherCollider.position.y);*/
    let dist=Vec2.Mod(Vec2.Sub(collider.position,otherCollider.position));
    let sumRadius=collider.radius+otherCollider.radius;
    return dist<=sumRadius;
  }

  BoxCircleColision(collider,otherCollider){
    let dist;
    let distX;
    let distY;
    if (collider.type='circleCollider'){
      dist=this.Projections(collider,otherCollider);
      return dist<=collider.radius;
    }
    else if(collider.type='boxCollider'){
      dist=this.Projections(otherCollider,collider);
      return dist<=otherCollider.radius;
    }
    return false;
  }

  Projections(circle,box){
    let minDist;
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

  BoxesColision(collider,otherCollider){
    let contX=0;
    let contY=0;
    if (collider.downPos.y<=otherCollider.downPos.y && otherCollider.downPos.y<=collider.upPos.y){
      //Log("lado de abajo dentro");
      contY++;
    }

    if (collider.downPos.y<=otherCollider.upPos.y && otherCollider.upPos.y<=collider.upPos.y){
      //Log("lado de arriba dentro");
      contY++;
    }

    if(collider.leftPos.x<=otherCollider.rightPos.x && otherCollider.rightPos.x<=collider.rightPos.x){
      //Log("lado derecho dentro");
      contX++;
    }

    if(collider.leftPos.x<=otherCollider.leftPos.x && otherCollider.leftPos.x<=collider.rightPos.x){
      //Log("lado izquierdo dentro");
      contX++;
    }

    return contX>=1 && contY>=1;
  }
}

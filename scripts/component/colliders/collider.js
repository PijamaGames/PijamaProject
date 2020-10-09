class Collider{
  constructor(){
    this.type = "collider";
  }


  CirclesColision(collider,otherCollider){
    let distX=Math.abs(collider.position.x-otherCollider.position.x);
    let distY=Math.abs(collider.position.y-otherCollider.position.y);
    let sumRadius=collider.radius+otherCollider.radius;
    return distX<=sumRadius && distY<=sumRadius;
  }

  BoxCircleColision(collider,otherCollider){

    //proyecciones

  }

  BoxesColision(collider,otherCollider){
    let cont=0;
    if (collider.downPos.y<=otherCollider.downPos.y && otherCollider.downPos.y<=collider.upPos.y)
      cont++;

    if (collider.downPos.y<=otherCollider.upPos.y && otherCollider.upPos.y<=collider.upPos.y)
      cont++;

    if(collider.leftPos.x<=otherCollider.rightPos.x && otherCollider.rightPos.x<=collider.rightPos.x)
      cont++;

    if(collider.leftPos.x<=otherCollider.leftPos.x && otherCollider.leftPos.x<=collider.rightPos.x)
      cont++;

    return cont>=2;
  }
}

class Collider{
  constructor(){
    this.type = "collider";
    this.collider=this;
  }


  CirclesColision(collider,otherCollider){
    let distX=Math.abs(collider.position.x-otherCollider.position.x);
    let distY=Math.abs(collider.position.y-otherCollider.position.y);
    let sumRadius=collider.radius+otherCollider.radius;
    Log("distancia en eje x: "+distX+" distancia en eje y: "+distY+" suma de los radios: "+sumRadius);
    return distX<sumRadius && distY<sumRadius;
  }

  BoxCircleColision(collider,otherCollider){

    //proyecciones

  }

  BoxesColision(collider,otherCollider){
    let cont=0;
    if (collider.downPos.y<=otherCollider.downPos.y && otherCollider.downPos.y<=collider.upPos.y){
      cont++;
      Log("parte de abajo entra");
    }
    if (collider.downPos.y<=otherCollider.upPos.y && otherCollider.upPos.y<=collider.upPos.y){
      cont++;
      Log("parte de arriba entra");
    }
    if(collider.leftPos.x<=otherCollider.rightPos.x && otherCollider.rightPos.x<=collider.rightPos.x){
      cont++;
      Log("leftPos mi collider "+collider.leftPos.x+" rightPos mi collider "+collider.rightPos.x+ " rightPos otro collider "+otherCollider.rightPos.x);
      Log("parte de derecha entra");
    }
    if(collider.leftPos.x<=otherCollider.leftPos.x && otherCollider.leftPos.x<=collider.rightPos.x){
      cont++;
      Log("leftPos mi collider "+collider.leftPos.x+" rightPos mi collider "+collider.rightPos.x+ " leftPos otro collider "+otherCollider.leftPos.x);
      Log("parte de izquierda entra");
    }
    return cont>=2;
  }
}

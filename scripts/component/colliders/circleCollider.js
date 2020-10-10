class CircleCollider extends Collider{
  constructor(radius,displacement,colliderGroup){
    super();
    Object.assign(this,{radius,displacement,colliderGroup});
    this.type="circleCollider";
    this.position=this.colliderGroup.gameobj.transform.position;
    this.position.Add(this.displacement);

  }

  OnColisionEnter(otherCollider){
    if(otherCollider.type=="circleCollider")
      return this.CirclesColision(this,otherCollider);

    else if(otherCollider.type=="boxCollider")
      return this.BoxCircleColision(this,otherCollider);

    else
      return false;
  }
}

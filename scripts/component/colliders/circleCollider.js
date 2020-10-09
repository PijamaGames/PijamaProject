class CircleCollider extends Collider{
  constructor(radius,displacement,colliderGroup){
    super();
    Object.assign(this,{radius,displacement,colliderGroup});
    this.type="circleCollider";
    this.position=colliderGroup.gameobj.transform.position;
    this.position.Add(this.displacement);

  }

  OncolisionEnter(otherCollider){
    if(otherCollider.type=="circleCollider")
      return this.CirclesColision(this,otherCollider);

    else if(otherCollider.type=="boxCollider")
      return this.BoxCircleColision(this,otherCollider);

    else
      return false;
  }
}

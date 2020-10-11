class CircleCollider extends Collider{
  constructor(radius,displacement,colliderGroup){
    super();
    Object.assign(this,{radius,displacement,colliderGroup});
    this.type="circleCollider";
    this.position=this.colliderGroup.gameobj.transform.position;
    this.position.Add(this.displacement);

  }

  OnCollisionEnter(otherCollider){
    if(otherCollider.type=="circleCollider")
      return this.CirclesCollision(this,otherCollider);

    else if(otherCollider.type=="boxCollider")
      return this.BoxCircleCollision(this,otherCollider);

    else
      return [];
  }
}

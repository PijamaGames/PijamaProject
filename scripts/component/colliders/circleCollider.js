class CircleCollider extends Collider{
  constructor(radius,displacement,position){
    super();
    Object.assign(this,{radius,displacement,position});
    this.type="circleCollider";
    this.position.Add(this.displacement);
    this.collider=this;

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

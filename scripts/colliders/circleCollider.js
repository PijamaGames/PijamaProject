class CircleCollider extends Collider{
  constructor(displacement = new Vec2(), radius = 0.5){
    super(displacement);
    Object.assign(this,{radius,displacement});
    this.type="circleCollider";
    this.scale = new Vec2(radius*2.0, radius*2.0);
    this.circular = 1.0;
    //this.position=this.colliderGroup.gameobj.transform.position;
    //this.position.Add(this.displacement);
  }

  get vertDisplacement(){
    let pos = this.worldCenter;
    let scl = this.radius*2.0;
    //let acr = this.colliderGroup.gameobj.transform.anchor;
    let h = this.colliderGroup.gameobj.transform.height;
    //Log(pos.toString());
    return new Vec2(
      (pos.x/scl-0.5/*-acr.x*/)*2.0+1.0,
      ((pos.y+h)/scl-0.5/*-acr.y*/)*2.0+1.0
    )
  }

  /*OnCollisionEnter(otherCollider){
    if(otherCollider.type=="circleCollider")
      return this.CirclesCollision(this,otherCollider);

    else if(otherCollider.type=="boxCollider")
      return this.BoxCircleCollision(this,otherCollider);

    else
      return [];
  }*/
}

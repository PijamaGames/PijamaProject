class BoxCollider extends Collider{
  constructor(height,width,colliderGroup){
    super();
    Object.assign(this,{height,width,colliderGroup});
    this.type="boxCollider";
    this.position=this.colliderGroup.gameobj.transform.position;
    this.leftUpCorner=new Vec2(this.leftPos.x,this.upPos.y);
    this.leftDownCorner=new Vec2(this.leftPos.x,this.downPos.y);
    this.rightUpCorner=new Vec2(this.rightPos.x,this.upPos.y);
    this.rightDownCorner=new Vec2(this.rightPos.x,this.downPos.y);
  }

  OnCollisionEnter(otherCollider){
    if(otherCollider.type=="circleCollider")
      return this.BoxCircleCollision(this,otherCollider);

    else if(otherCollider.type=="boxCollider")
      return this.BoxesCollision(this,otherCollider);

    else
      return [];
  }

  get leftPos(){
    return new Vec2(this.position.x-(this.width/2),this.position.y);
  }

  get rightPos(){
    return new Vec2(this.position.x+(this.width/2),this.position.y);
  }

  get upPos(){
    return new Vec2(this.position.x,this.position.y+(this.height/2));
  }

  get downPos(){
    return new Vec2(this.position.x,this.position.y-(this.height/2));
  }

}

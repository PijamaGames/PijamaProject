class BoxCollider extends Collider{
  constructor(height,width,colliderGroup){
    super();
    Object.assign(this,{height,width,colliderGroup});
    this.type="boxCollider";
    this.position=colliderGroup.gameobj.transform.position;
  }

  OnColisionEnter(otherCollider){
    if(otherCollider.type=="circleCollider")
      return this.BoxCircleColision(this,otherCollider);

    else if(otherCollider.type=="boxCollider")
      return this.BoxesColision(this,otherCollider);

    else
      return false;
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

class BoxCollider extends Collider{
  constructor(displacement = new Vec2(),width = 1.0, height = 1.0, isTrigger=false, onTriggerEnterCallback, onTriggerStayCallback,onTriggerExitCallback){
    super(displacement,isTrigger, onTriggerEnterCallback, onTriggerStayCallback,onTriggerExitCallback);
    Object.assign(this,{height,width});
    this.type="boxCollider";
    this.scale = new Vec2(width, height);
  }

  get leftUpCorner(){
    return new Vec2(this.leftPos.x,this.upPos.y);
  }
  get leftDownCorner(){
    return new Vec2(this.leftPos.x,this.downPos.y);
  }
  get rightUpCorner(){
    return new Vec2(this.rightPos.x,this.upPos.y);
  }
  get rightDownCorner(){
    return new Vec2(this.rightPos.x,this.downPos.y);
  }

  get vertDisplacement(){
    let pos = this.worldCenter;
    let h = this.colliderGroup.gameobj.transform.height;
    return new Vec2(
      (pos.x/this.width-0.5)*2.0+1.0,
      ((pos.y+h)/this.height-0.5)*2.0+1.0
    )
  }

  get leftPos(){
    let wp = this.worldCenter;
    return new Vec2(wp.x-(this.width/2.0),wp.y);
  }

  get rightPos(){
    let wp = this.worldCenter;
    return new Vec2(wp.x+(this.width/2.0),wp.y);
  }

  get upPos(){
    let wp = this.worldCenter;
    return new Vec2(wp.x,wp.y+(this.height/2.0));
  }

  get downPos(){
    let wp = this.worldCenter;
    return new Vec2(wp.x,wp.y-(this.height/2.0));
  }

}

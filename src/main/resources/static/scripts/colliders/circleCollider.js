class CircleCollider extends Collider{
  constructor(displacement = new Vec2(), radius = 0.5, isTrigger=false, onTriggerEnterCallback, onTriggerStayCallback,onTriggerExitCallback){
    super(displacement, isTrigger, onTriggerEnterCallback, onTriggerStayCallback,onTriggerExitCallback);
    Object.assign(this,{radius,displacement});
    this.type="circleCollider";
    this.scale = new Vec2(radius*2.0, radius*2.0);
    this.circular = 1.0;
  }
  get isCircular(){
    return this.circular >= 0.98;
  }

  get vertDisplacement(){
    let pos = this.worldCenter;
    //pos.y += h;
    let scl = this.radius*2.0;
    //let acr = this.colliderGroup.gameobj.transform.anchor;
    let h = this.colliderGroup.gameobj.transform.height;
    //Log(pos.toString());
    return new Vec2(
      (pos.x/scl-0.5)*2.0+1.0,
      ((pos.y)/scl-0.5)*2.0+1.0
    )
  }


}

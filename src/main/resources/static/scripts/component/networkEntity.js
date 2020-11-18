class NetworkEntity extends Component{
  constructor(){
    super();
    this.type = "networkEntity";
    this.targetPosition = new Vec2();
    this.lerpPos = 10.0;
  }

  Destroy(){
    this.gameobj.scene.networkEntities.delete(this.gameobj.key);
  }

  OnSetActive(active){
    if(active && user && user.isClient){
      this.gameobj.transform.SetWorldPosition(this.targetPosition);
    }
  }

  SetTargetPosition(v){
    this.targetPosition = v;
    if(this.gameobj.isStatic){
      this.gameobj.transform.SetWorldPosition(v);
    }
  }

  Update(){
    if(user && user.isClient){
      let lerp = this.lerpPos * manager.delta;
      let wp = this.gameobj.transform.GetWorldPos();
      let pos = new Vec2(
        wp.x * (1.0-lerp) + this.targetPosition.x * lerp,
        wp.y * (1.0-lerp) + this.targetPosition.y * lerp
      );
      this.gameobj.transform.SetWorldPosition(pos);
    }

  }

  GetInfo(){
    let wp = this.gameobj.transform.GetWorldPos();
    var info = {
      key:this.gameobj.key,
      type:this.gameobj.type,
      id:this.gameobj.id,
      posX:wp.x,
      posY:wp.y,
      height:this.gameobj.transform.height,
      active:this.gameobj.active,
    }

    if(this.gameobj.lightSource){
      info.ratio = this.gameobj.lightSource.ratio;
      info.strength = this.gameobj.lightSource.strength;
    }

    if(this.gameobj.rigidbody){
      info.velocityX = this.gameobj.rigidbody.velocity.x;
      info.velocityY = this.gameobj.rigidbody.velocity.y;
    }

    if(this.gameobj.renderer){
      info.tileX = this.gameobj.renderer.tile.x;
      info.tileY = this.gameobj.renderer.tile.y;
      if(this.gameobj.renderer.anim){
        info.anim = this.gameobj.renderer.anim;
      }
      /*else{
        info.anim = -1;
      }*/
      info.tintR = this.gameobj.renderer.tint[0];
      info.tintG = this.gameobj.renderer.tint[1];
      info.tintB = this.gameobj.renderer.tint[2];
    } /*else {
      info.tileX = -1;
      info.tileY = -1;
      info.anim = -1;
      info.tintR = -1;
      info.tintG = -1;
      info.tintB = -1;
    }*/
    return info;
  }

  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.networkEntity = this;
    this.gameobj.scene.networkEntities.set(this.gameobj.key, this);

    if(user && user.isClient){
      if(this.gameobj.rigidbody){
        this.gameobj.rigidbody.drag *= 0.05;
      }
      this.targetPosition = this.gameobj.transform.GetWorldPos();
    }
  }
}

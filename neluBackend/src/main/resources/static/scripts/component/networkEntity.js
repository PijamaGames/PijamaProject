class NetworkEntity extends Component{
  constructor(){
    super();
    this.type = "networkEntity";
  }

  Destroy(){
    this.gameobj.scene.networkEntities.delete(this.gameobj.key);
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

    if(this.gameobj.renderer){
      info.tileX = this.gameobj.renderer.tile.x;
      info.tileY = this.gameobj.renderer.tile.y;
      if(this.gameobj.renderer.anim){
        info.anim = this.gameobj.renderer.anim;
      }
      else{
        info.anim = -1;
      }
      info.tintR = this.gameobj.renderer.tint[0];
      info.tintG = this.gameobj.renderer.tint[1];
      info.tintB = this.gameobj.renderer.tint[2];
    } else {
      info.tileX = -1;
      info.tileY = -1;
      info.anim = -1;
      info.tintR = -1;
      info.tintG = -1;
      info.tintB = -1;
    }
    return info;
  }

  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.networkEntity = this;
    this.gameobj.scene.networkEntities.set(this.gameobj.key, this);
  }
}

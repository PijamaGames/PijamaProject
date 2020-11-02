class ShadowCaster extends Component{
  constructor(displacement = new Vec2(), ratio = 0.5){
    super();
    Object.assign(this, {displacement, ratio});
    this.type = "shadowCaster";
  }

  Destroy(){
    this.gameobj.shadowCasters.delete(this);
    lighting.shadowCasters.splice(lighting.shadowCasters.indexOf(this), 1);
  }

  get worldPos(){
    return this.gameobj.transform.GetWorldCenter().Copy().Add(this.displacement);
  }

  SetGameobj(gameobj){
    this.gameobj = gameobj;
    if(!this.gameobj.shadowCasters)
      this.gameobj.shadowCasters = new Set();

    this.gameobj.shadowCasters.add(this);
    lighting.shadowCasters.push(this);
  }
}
